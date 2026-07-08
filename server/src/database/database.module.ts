import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';

type DatabaseConfig = ConfigType<typeof databaseConfig>;

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [databaseConfig.KEY],
            useFactory: (dbConfig: DatabaseConfig) => ({
                type: 'postgres',
                host: dbConfig.host,
                port: dbConfig.port,
                username: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.database,
                //logging: true,
                autoLoadEntities: true,
                synchronize: false,
            }),
        }),
    ],
})
export class DatabaseModule {}
