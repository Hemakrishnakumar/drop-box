import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
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
