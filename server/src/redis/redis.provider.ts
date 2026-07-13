import { Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';

import redisConfig from 'src/config/redis.config';
import { REDIS_CLIENT } from './redis.constants';

type RedisConfig = ConfigType<typeof redisConfig>;

export const redisProviders: Provider[] = [
    {
        provide: REDIS_CLIENT,
        inject: [redisConfig.KEY],
        useFactory: (config: RedisConfig) => {
            return new Redis({
                host: config.host,
                port: config.port,
            });
        },
    },
];
