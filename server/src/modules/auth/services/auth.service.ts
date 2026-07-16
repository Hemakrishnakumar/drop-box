import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { RegisterInput } from '../inputs/register.input';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import { Folder } from '../../storage/entities/folder.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from '../../user/enums/user-status';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { BULLMQ_QUEUES, QUEUE_JOBS } from '../constants/queue.constants';
import { VerifyEmailInput } from '../inputs/verify-email.input';
import { createHmac, timingSafeEqual } from 'crypto';
import { ResendVerificationEmailInput } from '../inputs/resend-verification-email.input';
import { LoginInput } from '../inputs/login.input';
import type { GraphqlContext } from 'src/common/types/common';
import { SessionService } from './session.service';
import { LoggedInUserOutput, LoginOutput } from '../outputs/login.output';

type AppConfig = ConfigType<typeof appConfig>;

interface EmailVerificationTokenPayload {
    email: string;
    type: 'email-verification';
    exp: number;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(appConfig.KEY)
        private appConfig: AppConfig,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @InjectQueue(BULLMQ_QUEUES.AUTH)
        private queue: Queue,
        private sessionService: SessionService,
    ) {}

    async register(registerInput: RegisterInput): Promise<void> {
        const { email, firstName, lastName, password } = registerInput;

        const existingUser = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new ConflictException('Email already exists.');
        }

        const hashedPassword = await argon2.hash(password);
        const shouldVerifyEmail: boolean = this.appConfig.enableEmailVerification;

        await this.dataSource.transaction(async (manager) => {
            const userRepository = manager.getRepository(User);
            const folderRepository = manager.getRepository(Folder);

            const user = await userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                emailVerified: !shouldVerifyEmail,
                status: shouldVerifyEmail ? UserStatus.PENDING_VERIFICATION : UserStatus.ACTIVE,
            });

            const rootFolder = await folderRepository.save({
                name: '/',
                owner: user,
            });

            user.rootFolder = rootFolder;

            await userRepository.save(user);
        });
        if (shouldVerifyEmail) {
            await this.queue.add(
                QUEUE_JOBS.SEND_VERIFICATION_EMAIL,
                {
                    email,
                    name: firstName,
                },
                {
                    attempts: 5,
                    backoff: {
                        type: 'exponential',
                        delay: 3000,
                    },
                    removeOnComplete: 100,
                    removeOnFail: 1000,
                },
            );
        }
    }

    async verifyEmail(dto: VerifyEmailInput): Promise<void> {
        const payload = this.verifyEmailVerificationToken(dto.token);
        const user = await this.userRepository.findOne({
            where: {
                email: payload.email,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        if (user.emailVerified && user.status === UserStatus.ACTIVE) {
            return;
        }
        user.emailVerified = true;
        user.status = UserStatus.ACTIVE;

        await this.userRepository.save(user);
    }

    async resendVerificationEmail(dto: ResendVerificationEmailInput): Promise<void> {
        const email = dto.email ?? this.getEmailFromVerificationToken(dto.token);

        if (!email) {
            throw new BadRequestException('Email or verification token is required.');
        }

        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        if (user.emailVerified) {
            throw new BadRequestException('Email is already verified.');
        }

        await this.queue.add(
            QUEUE_JOBS.SEND_VERIFICATION_EMAIL,
            {
                email: user.email,
                name: user.firstName,
            },
            {
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 3000,
                },
                removeOnComplete: 100,
                removeOnFail: 1000,
            },
        );
    }

    async login(dto: LoginInput, context: GraphqlContext): Promise<LoginOutput> {
        const { email, password } = dto;
        const { req, res } = context;
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                password: true,
                emailVerified: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
                storageUsed: true,
            },
        });
        if (!user || !user?.password || !(await argon2.verify(user.password, password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (!user.emailVerified) {
            throw new BadRequestException('Email is not yet verified, Please verify email');
        }
        const session = await this.sessionService.create(user.id, {
            ipAddress: req.ip ?? req.socket.remoteAddress ?? 'unknown',
            userAgent: req.get('user-agent') ?? 'unknown',
        });

        res.cookie('sessionId', session.id, {
            httpOnly: true,
            secure: this.appConfig.env === 'production',
            sameSite: this.appConfig.env === 'production' ? 'none' : 'lax',
            expires: session.expiresAt,
            path: '/',
        });

        return {
            success: true,
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                photo: user.profilePhoto,
                storageUsed: String(user.storageUsed),
            },
        };
    }

    async profile(userId: string): Promise<LoggedInUserOutput> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('Session is invalid.');
        }

        return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            photo: user.profilePhoto,
            storageUsed: String(user.storageUsed),
        };
    }

    private verifyEmailVerificationToken(token: string): EmailVerificationTokenPayload {
        const secret = this.appConfig.tokenSecret;

        if (!secret) {
            throw new Error('Email verification token secret is not configured.');
        }

        const [payloadPart, signature] = token.split('.');

        if (!payloadPart || !signature) {
            throw new BadRequestException('Invalid verification token.');
        }

        const expectedSignature = createHmac('sha256', secret)
            .update(payloadPart)
            .digest('base64url');

        if (!this.isSignatureValid(signature, expectedSignature)) {
            throw new BadRequestException('Invalid verification token.');
        }

        const payload = this.parseEmailVerificationPayload(payloadPart);
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
            throw new BadRequestException('Verification link has expired.');
        }

        return payload;
    }

    private getEmailFromVerificationToken(token?: string): string | undefined {
        if (!token) {
            return undefined;
        }

        const [payloadPart, signature] = token.split('.');

        if (!payloadPart || !signature) {
            throw new BadRequestException('Invalid verification token.');
        }

        const expectedSignature = createHmac('sha256', this.getTokenSecret())
            .update(payloadPart)
            .digest('base64url');

        if (!this.isSignatureValid(signature, expectedSignature)) {
            throw new BadRequestException('Invalid verification token.');
        }

        return this.parseEmailVerificationPayload(payloadPart).email;
    }

    private parseEmailVerificationPayload(payloadPart: string): EmailVerificationTokenPayload {
        try {
            const payload = JSON.parse(
                Buffer.from(payloadPart, 'base64url').toString('utf8'),
            ) as Partial<EmailVerificationTokenPayload>;

            if (
                !payload.email ||
                payload.type !== 'email-verification' ||
                typeof payload.exp !== 'number'
            ) {
                throw new Error('Invalid payload.');
            }

            return {
                email: payload.email,
                type: payload.type,
                exp: payload.exp,
            };
        } catch {
            throw new BadRequestException('Invalid verification token.');
        }
    }

    private isSignatureValid(signature: string, expectedSignature: string): boolean {
        const signatureBuffer = Buffer.from(signature);
        const expectedSignatureBuffer = Buffer.from(expectedSignature);

        if (signatureBuffer.length !== expectedSignatureBuffer.length) {
            return false;
        }

        return timingSafeEqual(signatureBuffer, expectedSignatureBuffer);
    }

    private getTokenSecret(): string {
        const secret = this.appConfig.tokenSecret;

        if (!secret) {
            throw new Error('Email verification token secret is not configured.');
        }

        return secret;
    }
}
