import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './config/validation';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env.development',
            validationSchema,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    constructor() {
        console.log('this');
    }
}
