import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@ArgsType()
export class RegisterInput {
    @Field()
    @IsString()
    @Length(3, 100)
    firstName!: string;

    @Field()
    @IsString()
    @Length(3, 100)
    lastName!: string;

    @Field()
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @Field()
    @IsString()
    @Length(8, 100)
    password!: string;
}
