import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { ResendVerificationEmailInput } from './inputs/resend-verification-email.input';
import { VerifyEmailInput } from './inputs/verify-email.input';
import { GoogleSignInInput } from './inputs/google-sign-in.input';
import { AuthMessageOutput } from './outputs/auth-message.output';
import { AuthService } from './services/auth.service';
import { LoggedInUserOutput, LoginOutput } from './outputs/login.output';
import type { GraphqlContext } from 'src/common/types/common';
import { Public } from 'src/common/decorators/public.decorator';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Query(() => String)
    @Public()
    authApiStatus(): string {
        return 'Auth GraphQL API is available';
    }

    @Mutation(() => AuthMessageOutput)
    @Public()
    async register(@Args() input: RegisterInput): Promise<AuthMessageOutput> {
        await this.authService.register(input);
        return { message: 'Registered successfully', success: true };
    }

    @Mutation(() => AuthMessageOutput)
    @Public()
    async verifyEmail(@Args() input: VerifyEmailInput): Promise<AuthMessageOutput> {
        await this.authService.verifyEmail(input);
        return { message: 'Email validated successfully', success: true };
    }

    @Mutation(() => AuthMessageOutput)
    @Public()
    async resendVerification(
        @Args() input: ResendVerificationEmailInput,
    ): Promise<AuthMessageOutput> {
        await this.authService.resendVerificationEmail(input);
        return { message: 'Verification email sent successfully', success: true };
    }

    @Mutation(() => LoginOutput)
    @Public()
    async login(
        @Args() input: LoginInput,
        @Context() { req, res }: GraphqlContext,
    ): Promise<LoginOutput> {
        return this.authService.login(input, { req, res });
    }

    @Mutation(() => LoginOutput)
    @Public()
    async googleSignIn(
        @Args() input: GoogleSignInInput,
        @Context() { req, res }: GraphqlContext,
    ): Promise<LoginOutput> {
        return this.authService.googleSignIn(input, { req, res });
    }

    @Mutation(() => AuthMessageOutput)
    async logout(@Context() context: GraphqlContext): Promise<AuthMessageOutput> {
        await this.authService.logout(context);
        return { message: 'Logged out successfully', success: true };
    }

    @Query(() => LoggedInUserOutput)
    async profile(@Context() context: GraphqlContext): Promise<LoggedInUserOutput> {
        if (!context.userId) {
            throw new UnauthorizedException('Authentication is required.');
        }

        return this.authService.profile(context.userId);
    }
}
