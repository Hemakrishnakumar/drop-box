import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { Button } from '@/components/ui/button';
import { DataModal } from '@/components/modals';
import { registerSchema, type RegisterFormData } from '@/validations/authValidation';
import type { FormFieldConfig } from '@/components/forms/types';
import { useAuth } from '@/context';
import { Mail } from 'lucide-react';



const registerFields: FormFieldConfig[] = [
    {
        name: 'name',
        type: 'input',
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true,
    },
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
        placeholder: 'Min 8 characters',
        // description: 'Must contain at least one uppercase letter and one number',
        required: true,
    },
    {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm Password',
        placeholder: 'Re-enter your password',
        required: true,
    },
];

const defaultValues: RegisterFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export default function Register() {
    const navigate = useNavigate();
    const { register, googleAuth, loading, error, clearError } = useAuth();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const handleSubmit = useCallback(
        async (data: RegisterFormData) => {
            try {
                await register(data);
                setRegisteredEmail(data.email);
                setShowSuccessModal(true);
            } catch {
                // error is set inside AuthContext
            }
        },
        [register],
    );

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigate('/login');
    };

    const handleGoogleSignUp = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            clearError();
            try {
                await googleAuth({ token: tokenResponse.access_token });
                navigate('/dashboard');
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
                        Create an account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">Sign up to get started today</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-border-mute-foreground p-8 shadow-sm">
                    {/* Error from AuthContext */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Register Form */}
                    <DynamicForm<RegisterFormData>
                        schema={registerSchema}
                        defaultValues={defaultValues}
                        fields={registerFields}
                        onSubmit={handleSubmit}
                        submitButtonText={loading ? 'Creating account...' : 'Create Account'}
                        validationMode='onChange'
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

                    {/* Google Sign-Up */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-3"
                        onClick={() => handleGoogleSignUp()}
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
                        {loading ? 'Please wait...' : 'Sign up with Google'}
                    </Button>

                    {/* Login Link */}
                    <p className={`mt-6 text-center text-sm text-muted-foreground`}>
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Success Modal */}
            <DataModal
                isOpen={showSuccessModal}
                onClose={handleSuccessModalClose}
                title="Account Created Successfully!"
                description="Registration Complete"
                size="md"
                showHeader={true}
                showFooter={true}
                closeButtonText="Go to Login"
            >
                <div className="flex flex-col items-center text-center py-6 px-4 space-y-5">

                    {/* Icon */}
                    <div className="rounded-full bg-primary/10 p-4">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>

                    {/* Main Message */}
                    <div className="space-y-2">
                        <p className="text-base font-medium text-foreground">
                            A verification link has been sent
                        </p>

                        <p className="text-sm text-muted-foreground">
                            to <span className="font-semibold text-foreground">{registeredEmail}</span>
                        </p>
                    </div>

                    {/* Divider (optional but nice) */}
                    <div className="w-full h-px bg-border" />

                    {/* Description */}
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Please check your email and click the link to verify your account and complete the registration process.
                    </p>

                </div>
            </DataModal>
        </div>
    );
}
