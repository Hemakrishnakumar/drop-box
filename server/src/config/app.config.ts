import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    baseUrl: process.env.APP_URL ?? `http://localhost:5173`,
    enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
    tokenSecret: process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
    sessionExpirationInHours: Number(process.env.SESSION_EXPIRATION_IN_HOURS),
}));
