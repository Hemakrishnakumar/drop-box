import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EmailService, SendEmailOptions } from './email.service';
import mailConfig from 'src/config/mail.config';

type MailConfig = ConfigType<typeof mailConfig>;

@Injectable()
export class NodemailerService extends EmailService {
    private readonly transporter: nodemailer.Transporter;

    constructor(
        @Inject(mailConfig.KEY)
        private readonly config: MailConfig,
    ) {
        super();

        const transportOptions: SMTPTransport.Options = {
            host: this.config.host,
            port: this.config.port,
            auth: {
                user: this.config.user,
                pass: this.config.password,
            },
        };

        this.transporter = nodemailer.createTransport(transportOptions);
    }

    async send(options: SendEmailOptions): Promise<void> {
        await this.transporter.sendMail({
            from: this.config.from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
    }
}
