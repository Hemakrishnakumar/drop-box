import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginFormData } from '@/validations/authValidation';
import type { FormFieldConfig } from '@/components/forms/types';
import { useAuth } from '@/context';



const loginFields: FormFieldConfig[] = [
    {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'you@example.com',
        required: true,
    },
    {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        required: true,
    },
];

const defaultValues: LoginFormData = {
    email: '',
    password: '',
};

export default function Login() {
    const { login, googleAuth, loading, error, clearError } = useAuth();

    const handleSubmit = useCallback(
        async (data: LoginFormData) => {
            try {
                await login(data);
            } catch {
                // error is set inside AuthContext
            }
        },
        [login],
    );

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            clearError();
            try {
                await googleAuth({ token: tokenResponse.access_token });
            } catch {
                // error is set inside AuthContext
            }
        },
        onError: () => {
            // Google popup itself failed — no token received
        },
    });

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-mute-foreground p-8 shadow-sm">
                    {/* Error from AuthContext */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <DynamicForm<LoginFormData>
                        schema={loginSchema}
                        defaultValues={defaultValues}
                        fields={loginFields}
                        onSubmit={handleSubmit}
                        submitButtonText={loading ? 'Signing in...' : 'Sign In'}
                    />

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-muted-foreground" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-background px-3 text-muted-foreground">or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-In */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-3"
                        onClick={() => handleGoogleLogin()}
                        disabled={loading}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        {loading ? 'Please wait...' : 'Sign in with Google'}
                    </Button>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-medium text-primary hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
