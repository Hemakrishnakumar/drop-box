import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import { RedisService } from 'src/redis/redis.service';

type AppConfig = ConfigType<typeof appConfig>;

interface SessionRequestMetadata {
    ipAddress: string;
    userAgent: string;
}

export interface SessionData extends SessionRequestMetadata {
    userId: string;
    createdAt: string;
    lastAccessedAt: string;
    expiresAt: string;
    browser: string;
    os: string;
    device: string;
}

interface CreatedSession {
    id: string;
    expiresAt: Date;
}

@Injectable()
export class SessionService {
    private static readonly KEY_PREFIX = 'session:';

    constructor(
        private readonly redisService: RedisService,
        @Inject(appConfig.KEY)
        private readonly appConfig: AppConfig,
    ) {}

    async create(userId: string, metadata: SessionRequestMetadata): Promise<CreatedSession> {
        const sessionId = randomUUID();
        const createdAt = new Date();
        const ttlInSeconds = this.getTtlInSeconds();
        const expiresAt = new Date(createdAt.getTime() + ttlInSeconds * 1000);
        const client = this.getClientDetails(metadata.userAgent);

        const session: SessionData = {
            userId,
            createdAt: createdAt.toISOString(),
            lastAccessedAt: createdAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
            ipAddress: metadata.ipAddress,
            userAgent: metadata.userAgent,
            ...client,
        };

        await this.redisService.set(
            `${SessionService.KEY_PREFIX}${sessionId}`,
            JSON.stringify(session),
            ttlInSeconds,
        );

        return { id: sessionId, expiresAt };
    }

    async get(sessionId: string): Promise<SessionData | null> {
        const key = `${SessionService.KEY_PREFIX}${sessionId}`;
        const serializedSession = await this.redisService.get(key);

        if (!serializedSession) {
            return null;
        }

        try {
            const session = JSON.parse(serializedSession) as Partial<SessionData>;

            if (!session.userId || !session.expiresAt) {
                await this.redisService.del(key);
                return null;
            }

            return session as SessionData;
        } catch {
            await this.redisService.del(key);
            return null;
        }
    }

    private getTtlInSeconds(): number {
        const ttlInSeconds = this.appConfig.sessionExpirationInHours * 60 * 60;

        if (!Number.isInteger(ttlInSeconds) || ttlInSeconds <= 0) {
            throw new Error('SESSION_EXPIRATION_IN_HOURS must be a positive number.');
        }

        return ttlInSeconds;
    }

    private getClientDetails(userAgent: string): Pick<SessionData, 'browser' | 'os' | 'device'> {
        return {
            browser: this.getBrowser(userAgent),
            os: this.getOperatingSystem(userAgent),
            device: this.getDevice(userAgent),
        };
    }

    private getBrowser(userAgent: string): string {
        if (/edg\//i.test(userAgent)) return 'Edge';
        if (/opr\//i.test(userAgent)) return 'Opera';
        if (/chrome|crios/i.test(userAgent)) return 'Chrome';
        if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
        if (/safari/i.test(userAgent)) return 'Safari';
        return 'Unknown';
    }

    private getOperatingSystem(userAgent: string): string {
        if (/windows nt/i.test(userAgent)) return 'Windows';
        if (/android/i.test(userAgent)) return 'Android';
        if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
        if (/mac os x/i.test(userAgent)) return 'macOS';
        if (/linux/i.test(userAgent)) return 'Linux';
        return 'Unknown';
    }

    private getDevice(userAgent: string): string {
        if (/ipad|tablet/i.test(userAgent)) return 'Tablet';
        if (/mobile|iphone|ipod|android/i.test(userAgent)) return 'Mobile';
        return 'Desktop';
    }
}
