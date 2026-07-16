import type {
    LoginMutation,
    LoginMutationVariables,
    ProfileQuery,
    RegisterMutationVariables,
    ResendVerificationMutationVariables,
    VerifyEmailMutationVariables,
} from '@/graphql/generated/graphql';
import {
    LoginDocument,
    ProfileDocument,
    RegisterDocument,
    ResendVerificationDocument,
    VerifyEmailDocument,
} from '@/graphql/generated/graphql';
import { graphqlClient } from '@/graphql/client';
import type {
    AuthUser,
    LoginPayload,
    RegisterPayload,
    ResendVerificationPayload,
    VerifyEmailPayload,
} from '@/types';



export const authService = {
    async login(payload: LoginPayload): Promise<NonNullable<LoginMutation['login']>> {
        const { data } = await graphqlClient.mutate({
            mutation: LoginDocument,
            variables: payload satisfies LoginMutationVariables,
            update(cache, result) {
                const user = result.data?.login.user;

                if (user) {
                    cache.writeQuery({
                        query: ProfileDocument,
                        data: { profile: user },
                    });
                }
            },
        });

        if (!data?.login.success) {
            throw new Error('Login failed. Please try again.');
        }

        return data.login;
    },

    async register(payload: RegisterPayload): Promise<void> {
        const { data } = await graphqlClient.mutate({
            mutation: RegisterDocument,
            variables: payload satisfies RegisterMutationVariables,
        });

        if (!data?.register.success) {
            throw new Error(data?.register.message ?? 'Registration failed. Please try again.');
        }
    },

    async getProfile(): Promise<AuthUser> {
        const { data } = await graphqlClient.query({
            query: ProfileDocument,
            fetchPolicy: 'cache-first',
        });

        return data.profile as ProfileQuery['profile'];
    },

    async verifyEmail(payload: VerifyEmailPayload): Promise<void> {
        const { data } = await graphqlClient.mutate({
            mutation: VerifyEmailDocument,
            variables: payload satisfies VerifyEmailMutationVariables,
        });

        if (!data?.verifyEmail.success) {
            throw new Error(data?.verifyEmail.message ?? 'Email verification failed.');
        }
    },

    async resendVerification(payload: ResendVerificationPayload): Promise<void> {
        const { data } = await graphqlClient.mutate({
            mutation: ResendVerificationDocument,
            variables: payload satisfies ResendVerificationMutationVariables,
        });

        if (!data?.resendVerification.success) {
            throw new Error(data?.resendVerification.message ?? 'Unable to resend verification email.');
        }
    },
};
