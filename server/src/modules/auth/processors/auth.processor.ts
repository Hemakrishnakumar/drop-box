import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { createHmac } from 'crypto';

import appConfig from 'src/config/app.config';
import { EMAIL_SERVICE } from 'src/modules/email/email.module';
import { EmailService } from 'src/modules/email/services/email.service';
import { renderEmailVerificationTemplate } from 'src/modules/email/templates/auth/email-verification.template';
import { BULLMQ_QUEUES, QUEUE_JOBS } from '../constants/queue.constants';

type AppConfig = ConfigType<typeof appConfig>;

interface SendVerificationEmailJobData {
    email: string;
    name: string;
}

@Processor(BULLMQ_QUEUES.AUTH)
export class AuthProcessor extends WorkerHost {
    constructor(
        @Inject(EMAIL_SERVICE)
        private readonly emailService: EmailService,
        @Inject(appConfig.KEY)
        private readonly appConfig: AppConfig,
    ) {
        super();
    }

    async process(job: Job<SendVerificationEmailJobData>): Promise<void> {
        switch (job.name) {
            case QUEUE_JOBS.SEND_VERIFICATION_EMAIL:
                return this.sendVerificationEmail(job.data);

            default:
                throw new Error(`Unknown job: ${job.name}`);
        }
    }

    private async sendVerificationEmail({
        email,
        name,
    }: SendVerificationEmailJobData): Promise<void> {
        const token = this.createEmailVerificationToken(email);
        const verificationUrl = this.createVerificationUrl(token);
        const html = renderEmailVerificationTemplate({
            name,
            verificationUrl,
        });

        await this.emailService.send({
            to: email,
            subject: 'Verify your Drop Box email',
            context: {
                name,
                verificationUrl,
            },
            html,
            text: [
                `Hi ${name},`,
                '',
                'Welcome to Drop Box. Confirm your email address to finish setting up your account.',
                verificationUrl,
                '',
                'This link expires in 1 hour.',
            ].join('\n'),
        });
    }

    private createEmailVerificationToken(email: string): string {
        const secret = this.appConfig.tokenSecret;

        if (!secret) {
            throw new Error('Email verification token secret is not configured.');
        }

        const payload = Buffer.from(
            JSON.stringify({
                email,
                type: 'email-verification',
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
            }),
        ).toString('base64url');
        const signature = createHmac('sha256', secret).update(payload).digest('base64url');

        return `${payload}.${signature}`;
    }

    private createVerificationUrl(token: string): string {
        const baseUrl = this.appConfig.baseUrl.replace(/\/$/, '');

        return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
    }
}
