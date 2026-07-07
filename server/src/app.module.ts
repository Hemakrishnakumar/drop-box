import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './config/validation';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import appConfig from './config/app.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env.development',
            validationSchema,
            load: [databaseConfig, appConfig],
        }),
        DatabaseModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
