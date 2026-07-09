import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ResendVerificationEmailDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    token?: string;
}
