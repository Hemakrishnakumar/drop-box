import { Module } from '@nestjs/common';
import { NodemailerService } from './services/nodemailer.service';

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');

@Module({
    providers: [
        {
            provide: EMAIL_SERVICE,
            useClass: NodemailerService,
        },
    ],
    exports: [EMAIL_SERVICE],
})
export class EmailModule {}
