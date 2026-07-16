import { gql } from '@apollo/client';



export const USER_FIELDS = gql`
    fragment UserFields on LoggedInUserOutput {
        email
        firstName
        lastName
        photo
        storageUsed
    }
`;

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            success
            user {
                ...UserFields
            }
        }
    }
    ${USER_FIELDS}
`;

export const LOGOUT = gql`
    mutation Logout {
        logout {
            success
            message
        }
    }
`;

export const GOOGLE_SIGN_IN = gql`
    mutation GoogleSignIn($token: String!) {
        googleSignIn(token: $token) {
            success
            user {
                ...UserFields
            }
        }
    }
    ${USER_FIELDS}
`;

export const REGISTER = gql`
    mutation Register(
        $email: String!
        $firstName: String!
        $lastName: String!
        $password: String!
    ) {
        register(email: $email, firstName: $firstName, lastName: $lastName, password: $password) {
            success
            message
        }
    }
`;

export const PROFILE = gql`
    query Profile {
        profile {
            ...UserFields
        }
    }
    ${USER_FIELDS}
`;

export const VERIFY_EMAIL = gql`
    mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token) {
            success
            message
        }
    }
`;

export const RESEND_VERIFICATION = gql`
    mutation ResendVerification($email: String!) {
        resendVerification(email: $email) {
            success
            message
        }
    }
`;
