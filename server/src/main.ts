import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BULLMQ_QUEUES } from './modules/auth/constants/queue.constants';

const BULL_BOARD_PATH = '/admin/queues';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const serverAdapter = new ExpressAdapter();
    const authQueue = app.get<Queue>(getQueueToken(BULLMQ_QUEUES.AUTH));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    serverAdapter.setBasePath(BULL_BOARD_PATH);

    createBullBoard({
        queues: [new BullMQAdapter(authQueue)],
        serverAdapter,
    });

    app.use(BULL_BOARD_PATH, serverAdapter.getRouter());

    await app.listen(5000);
}
void bootstrap();
