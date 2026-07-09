import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('/api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        await this.authService.register(dto);
        return { message: 'Registered successfully' };
    }

    @Post('verify-email')
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        await this.authService.verifyEmail(dto);
        return { message: 'Email validated successfully' };
    }

    @Post('resend-verification')
    async resendVerification(@Body() dto: ResendVerificationEmailDto) {
        await this.authService.resendVerificationEmail(dto);
        return { message: 'Verification email sent successfully' };
    }
}
