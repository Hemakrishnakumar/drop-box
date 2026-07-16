import { Field, ArgsType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@ArgsType()
export class LoginInput {
    @Field()
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @Field()
    @IsString()
    @Length(8, 100)
    password!: string;
}
