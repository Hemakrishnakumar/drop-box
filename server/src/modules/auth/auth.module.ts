import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Folder } from '../storage/entities/folder.entity';
import { BullModule } from '@nestjs/bullmq';
import { BULLMQ_QUEUES } from './constants/queue.constants';
import { EmailModule } from '../email/email.module';
import { AuthProcessor } from './processors/auth.processor';
import { AuthResolver } from './auth.resolver';
import { RedisModule } from 'src/redis/redis.module';
import { SessionService } from './services/session.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Folder]),
        EmailModule,
        RedisModule,
        BullModule.registerQueue({
            name: BULLMQ_QUEUES.AUTH,
        }),
    ],
    providers: [AuthService, AuthProcessor, AuthResolver, SessionService],
    exports: [SessionService],
})
export class AuthModule {}
