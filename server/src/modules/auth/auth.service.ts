import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import { Folder } from '../storage/entities/folder.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from '../user/enums/user-status';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { BULLMQ_QUEUES, QUEUE_JOBS } from './constants/queue.constants';

type AppConfig = ConfigType<typeof appConfig>;

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
    ) {}

    async register(registerDto: RegisterDto): Promise<void> {
        const { email, firstName, lastName, password } = registerDto;

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
}
