import type {
    LoginMutationVariables,
    RegisterMutationVariables,
    ResendVerificationMutationVariables,
    UserFieldsFragment,
    VerifyEmailMutationVariables,
} from '@/graphql/generated/graphql';

export type LoginPayload = LoginMutationVariables;
export type RegisterPayload = RegisterMutationVariables;
export type VerifyEmailPayload = VerifyEmailMutationVariables;
export type ResendVerificationPayload = ResendVerificationMutationVariables;
export type AuthUser = UserFieldsFragment;

export interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    clearError: () => void;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    refetchUser: () => Promise<void>;
}
