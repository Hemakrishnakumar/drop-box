export interface SendEmailOptions {
    to: string;
    subject: string;
    context: Record<string, unknown>;
    text?: string;
    html?: string;
}

export abstract class EmailService {
    abstract send(options: SendEmailOptions): Promise<void>;
}
