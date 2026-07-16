import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class ResendVerificationEmailInput {
    @Field()
    @IsEmail()
    email!: string;
}
