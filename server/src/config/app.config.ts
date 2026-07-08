import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: Number(process.env.PORT),
    baseUrl: process.env.APP_URL ?? `http://localhost:${process.env.PORT ?? 5173}`,
    enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
    tokenSecret: process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
}));
