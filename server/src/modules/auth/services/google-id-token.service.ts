import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createPublicKey, type JsonWebKey, verify as verifySignature } from 'crypto';
import appConfig from 'src/config/app.config';

type AppConfig = ConfigType<typeof appConfig>;

interface GoogleTokenHeader {
    alg?: string;
    kid?: string;
}

interface GoogleTokenPayload {
    aud?: string | string[];
    email?: string;
    email_verified?: boolean;
    exp?: number;
    family_name?: string;
    given_name?: string;
    iss?: string;
    name?: string;
    picture?: string;
    sub?: string;
}

interface GoogleJwk extends JsonWebKey {
    alg?: string;
    e?: string;
    kid?: string;
    kty?: string;
    n?: string;
    use?: string;
}

export interface VerifiedGoogleUser {
    email: string;
    firstName: string;
    lastName: string;
    photo?: string;
    subject: string;
}

@Injectable()
export class GoogleIdTokenService {
    private keys = new Map<string, GoogleJwk>();
    private keysExpireAt = 0;

    constructor(
        @Inject(appConfig.KEY)
        private readonly appConfig: AppConfig,
    ) {}

    async verify(token: string): Promise<VerifiedGoogleUser> {
        const clientId = this.appConfig.googleClientId;

        if (!clientId) {
            throw new BadRequestException('Google sign-in is not configured.');
        }

        const [encodedHeader, encodedPayload, encodedSignature, ...extraParts] = token.split('.');

        if (!encodedHeader || !encodedPayload || !encodedSignature || extraParts.length > 0) {
            throw new UnauthorizedException('Invalid Google ID token.');
        }

        const header = this.decodeJson<GoogleTokenHeader>(encodedHeader);
        const payload = this.decodeJson<GoogleTokenPayload>(encodedPayload);

        if (header.alg !== 'RS256' || !header.kid) {
            throw new UnauthorizedException('Invalid Google ID token.');
        }

        await this.verifyTokenSignature(
            `${encodedHeader}.${encodedPayload}`,
            encodedSignature,
            header.kid,
        );
        this.validateClaims(payload, clientId);

        const [fallbackFirstName = 'Google', ...remainingName] = (payload.name ?? '')
            .trim()
            .split(/\s+/);

        return {
            email: payload.email!,
            firstName: payload.given_name?.trim() || fallbackFirstName,
            lastName: payload.family_name?.trim() || remainingName.join(' ') || 'User',
            photo: payload.picture,
            subject: payload.sub!,
        };
    }

    private async verifyTokenSignature(
        signingInput: string,
        encodedSignature: string,
        keyId: string,
    ): Promise<void> {
        const key = await this.getKey(keyId);

        if (!key || key.kty !== 'RSA' || !key.n || !key.e) {
            throw new UnauthorizedException('Invalid Google ID token.');
        }

        const publicKey = createPublicKey({ key, format: 'jwk' });
        const isValid = verifySignature(
            'RSA-SHA256',
            Buffer.from(signingInput),
            publicKey,
            Buffer.from(encodedSignature, 'base64url'),
        );

        if (!isValid) {
            throw new UnauthorizedException('Invalid Google ID token.');
        }
    }

    private validateClaims(payload: GoogleTokenPayload, clientId: string): void {
        const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
        const now = Math.floor(Date.now() / 1000);

        if (
            !payload.sub ||
            !payload.email ||
            !payload.email_verified ||
            !payload.exp ||
            payload.exp <= now ||
            !audience.includes(clientId) ||
            (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com')
        ) {
            throw new UnauthorizedException('Google ID token is invalid or has expired.');
        }
    }

    private decodeJson<T>(value: string): T {
        try {
            return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T;
        } catch {
            throw new UnauthorizedException('Invalid Google ID token.');
        }
    }

    private async getKey(keyId: string): Promise<GoogleJwk | undefined> {
        if (Date.now() >= this.keysExpireAt || !this.keys.has(keyId)) {
            await this.refreshKeys();
        }

        return this.keys.get(keyId);
    }

    private async refreshKeys(): Promise<void> {
        let response: Response;

        try {
            response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
        } catch {
            throw new UnauthorizedException('Unable to verify Google ID token.');
        }

        if (!response.ok) {
            throw new UnauthorizedException('Unable to verify Google ID token.');
        }

        const body = (await response.json()) as { keys?: GoogleJwk[] };

        if (!body.keys?.length) {
            throw new UnauthorizedException('Unable to verify Google ID token.');
        }

        this.keys = new Map(body.keys.filter((key) => key.kid).map((key) => [key.kid!, key]));
        this.keysExpireAt = Date.now() + this.getCacheMaxAge(response.headers.get('cache-control'));
    }

    private getCacheMaxAge(cacheControl: string | null): number {
        const maxAge = /max-age=(\d+)/.exec(cacheControl ?? '')?.[1];
        return Math.max(60, Number(maxAge ?? 3600)) * 1000;
    }
}
