import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class VerifyEmailInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    token!: string;
}
