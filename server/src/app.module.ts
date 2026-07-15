import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import validationSchema from './config/validation';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import appConfig from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { StorageModule } from './modules/storage/storage.module';
import { BullModule } from '@nestjs/bullmq';
import redisConfig from './config/redis.config';
import mailConfig from './config/mail.config';
import { RedisModule } from './redis/redis.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';

type RedisConfig = ConfigType<typeof redisConfig>;

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validationSchema,
            load: [databaseConfig, appConfig, redisConfig, mailConfig],
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            path: '/graphql',
            autoSchemaFile: join(process.cwd(), 'schema.gql'),
            sortSchema: true,
            introspection: true,
            playground: true,
            graphiql: true,
        }),
        BullModule.forRootAsync({
            inject: [redisConfig.KEY],
            useFactory: (config: RedisConfig) => ({
                connection: {
                    host: config.host,
                    port: config.port,
                },
            }),
        }),
        DatabaseModule,
        AuthModule,
        StorageModule,
        RedisModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
