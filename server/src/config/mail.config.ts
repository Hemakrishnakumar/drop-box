import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT ? Number(process.env.NODEMAILER_PORT) : undefined,
    user: process.env.GMAIL_APP_USER,
    password: process.env.GMAIL_APP_PASSWORD,
    from: '"Hemakrishna" <dev.krish.learn@gmail.com>',
}));
