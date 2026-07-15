import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { ResendVerificationEmailInput } from './inputs/resend-verification-email.input';
import { VerifyEmailInput } from './inputs/verify-email.input';
import { AuthMessageOutput } from './outputs/auth-message.output';
import { AuthService } from './services/auth.service';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Query(() => String)
    authApiStatus(): string {
        return 'Auth GraphQL API is available';
    }

    @Mutation(() => AuthMessageOutput)
    async register(@Args('input') input: RegisterInput): Promise<AuthMessageOutput> {
        await this.authService.register(input);
        return { message: 'Registered successfully', success: true };
    }

    @Mutation(() => AuthMessageOutput)
    async verifyEmail(@Args('input') input: VerifyEmailInput): Promise<AuthMessageOutput> {
        await this.authService.verifyEmail(input);
        return { message: 'Email validated successfully', success: true };
    }

    @Mutation(() => AuthMessageOutput)
    async resendVerification(
        @Args('input') input: ResendVerificationEmailInput,
    ): Promise<AuthMessageOutput> {
        await this.authService.resendVerificationEmail(input);
        return { message: 'Verification email sent successfully', success: true };
    }

    @Mutation(() => AuthMessageOutput)
    async login(@Args('input') input: LoginInput): Promise<AuthMessageOutput> {
        await this.authService.login(input);
        return { message: 'Logged in successfully', success: true };
    }
}
