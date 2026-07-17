import type {
    LoginMutationVariables,
    GoogleSignInMutationVariables,
    RegisterMutationVariables,
    ResendVerificationMutationVariables,
    VerifyEmailMutationVariables,
} from '@/graphql/generated/graphql';



export type LoginPayload = LoginMutationVariables;
export type GoogleSignInPayload = GoogleSignInMutationVariables;
export type RegisterPayload = RegisterMutationVariables;
export type VerifyEmailPayload = VerifyEmailMutationVariables;
export type ResendVerificationPayload = ResendVerificationMutationVariables;
export interface AuthUser {
    email: string;
    firstName: string;
    lastName: string;
    photo?: string | null;
    storageUsed: string;
    rootFolderId: string;
}

export interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    clearError: () => void;
    login: (payload: LoginPayload) => Promise<void>;
    googleSignIn: (payload: GoogleSignInPayload) => Promise<void>;
    logout: () => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    refetchUser: () => Promise<void>;
}
