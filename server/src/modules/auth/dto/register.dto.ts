import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
    @IsString()
    @Length(3, 100)
    firstName!: string;

    @IsString()
    @Length(3, 100)
    lastName!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @Length(8, 100)
    password!: string;
}
