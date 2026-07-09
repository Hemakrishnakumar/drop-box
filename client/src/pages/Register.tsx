import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import type { ComponentType, InputHTMLAttributes, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Cloud,
    Eye,
    EyeOff,
    FileText,
    FolderSymlink,
    LockKeyhole,
    Mail,
    ShieldCheck,
    User,
    Zap,
} from 'lucide-react';

import { DataModal } from '@/components/modals';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { registerSchema, type RegisterFormData } from '@/validations/authValidation';
import { useAuth } from '@/context';



const featureItems = [
    { label: 'Secure Cloud Storage', icon: LockKeyhole },
    { label: 'Lightning-Fast Uploads', icon: Zap },
    { label: 'Smart File Organization', icon: FolderSymlink },
    { label: 'Enterprise-Grade Security', icon: ShieldCheck },
];

const fileRows = [
    ['Project Documents', 'Owner', '0103/2023 PM', '2.34 MB'],
    ['Financial Reports', 'Owner', '0810/2023 PM', '1.20 MB'],
    ['Marketing Materials', 'Owner', '0404/2023 PM', '--'],
    ['Quarterly-Presentation.pdf', 'Owner', '2903/2023 PM', '3.10 MB'],
    ['Client Contract.docx', 'Owner', '2802/2023 AM', '90 kbps'],
    ['Budget_Sheet.xlsx', 'Owner', '7203/2023 PM', '3.39 KB'],
];

const defaultValues: RegisterFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

function passwordStrength(password: string) {
    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;

    if (!password) return { score: 0, label: 'Weak' };
    if (score <= 2) return { score, label: 'Weak' };
    if (score === 3) return { score, label: 'Good' };
    return { score, label: 'Strong' };
}

function GoogleIcon() {
    return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
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
    );
}

export default function Register() {
    const navigate = useNavigate();
    const { register: registerUser, googleAuth, loading, error, clearError } = useAuth();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues,
        mode: 'onChange',
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const password = watch('password');
    const strength = useMemo(() => passwordStrength(password), [password]);
    const isBusy = loading || isSubmitting;

    useEffect(() => {
        const root = document.getElementById('root');

        root?.classList.add('registration-page-root');

        return () => {
            root?.classList.remove('registration-page-root');
        };
    }, []);

    const onSubmit = useCallback(
        async ({ firstName, lastName, email, password: formPassword }: RegisterFormData) => {
            try {
                await registerUser({
                    firstName,
                    lastName,
                    email,
                    password: formPassword,
                });
                setRegisteredEmail(email);
                setShowSuccessModal(true);
            } catch {
                // error is set inside AuthContext
            }
        },
        [registerUser],
    );

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
            // Google popup itself failed.
        },
    });

    return (
        <main className="min-h-screen bg-[#f4f6fb] text-[#06162f] lg:h-screen lg:overflow-hidden">
            <div className="grid min-h-screen lg:h-screen lg:min-h-0 lg:grid-cols-[0.92fr_1.2fr]">
                <section className="relative hidden overflow-hidden border-r border-[#dfe5f0] bg-[#f7f9fd] px-10 py-9 lg:flex lg:flex-col">
                    <div className="absolute inset-0 bg-[radial-gradient(#c8d4e6_1px,transparent_1px)] [background-size:22px_22px]" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0b6ff9] text-white shadow-sm">
                                <Cloud className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#001b3d]">
                                Nexus Cloud
                            </h1>
                        </div>
                        <p className="mt-4 text-sm font-medium text-[#2f3d57]">
                            Enterprise cloud storage built for modern teams.
                        </p>

                        <div className="mt-5 space-y-3.5">
                            {featureItems.map(({ label, icon: Icon }) => (
                                <div key={label} className="flex items-center gap-4">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e3efff] text-[#0b6ff9]">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-[#11213b]">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-auto">
                        <div className="rotate-[-2deg] rounded-lg border border-[#d8e0ec] bg-white p-3.5 shadow-[0_24px_50px_rgba(12,31,63,0.16)]">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-[#ccd5e2]" />
                                    <span className="h-2 w-2 rounded-full bg-[#ccd5e2]" />
                                    <span className="h-2 w-2 rounded-full bg-[#ccd5e2]" />
                                </div>
                                <div className="h-5 w-28 rounded border border-[#dfe5ee] bg-[#f8fafc]" />
                            </div>
                            <div className="grid grid-cols-[86px_1fr] overflow-hidden rounded border border-[#e3e8f0] text-[9px] text-[#637083]">
                                <aside className="space-y-1.5 bg-[#edf2f8] p-2.5">
                                    <div className="rounded bg-[#5d789d] px-3 py-1 text-center font-semibold text-white">
                                        + New
                                    </div>
                                    {['All Files', 'Recent', 'Shared with me', 'Favorites', 'Trash'].map(
                                        (item) => (
                                            <div key={item} className="flex items-center gap-1">
                                                <span className="h-2 w-2 rounded-sm border border-[#aab6c5]" />
                                                {item}
                                            </div>
                                        ),
                                    )}
                                </aside>
                                <div className="bg-white">
                                    <div className="grid grid-cols-[1.35fr_0.7fr_1fr_0.7fr] border-b border-[#e6ebf2] px-3 py-2 font-semibold">
                                        <span>Name</span>
                                        <span>Owner</span>
                                        <span>Last Modified</span>
                                        <span>File Size</span>
                                    </div>
                                    {fileRows.map(([name, owner, date, size]) => (
                                        <div
                                            key={name}
                                            className="grid grid-cols-[1.35fr_0.7fr_1fr_0.7fr] items-center border-b border-[#eef2f7] px-3 py-1.5"
                                        >
                                            <span className="flex items-center gap-1 font-medium text-[#3b485c]">
                                                <FileText className="h-3 w-3 text-[#0b6ff9]" />
                                                {name}
                                            </span>
                                            <span>{owner}</span>
                                            <span>{date}</span>
                                            <span>{size}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex min-h-screen items-center justify-center px-4 py-0 sm:px-6 lg:h-screen lg:min-h-0">
                    <div className="w-full max-w-[455px] rounded-xl border border-[#cbd5e5] bg-white px-10 py-6 shadow-sm max-sm:px-6">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold tracking-tight text-[#06162f]">
                                Create your account
                            </h2>
                            <p className="mt-0.5 text-sm font-medium text-[#32415a]">
                                Start organizing your files securely in minutes.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 w-full border-[#cbd5e5] bg-white text-sm font-bold text-[#17233a] hover:bg-[#f7faff]"
                            onClick={() => handleGoogleSignUp()}
                            disabled={isBusy}
                        >
                            <GoogleIcon />
                            Continue with Google
                        </Button>

                        <div className="my-4 flex items-center gap-4">
                            <div className="h-px flex-1 bg-[#d9e0eb]" />
                            <span className="text-xs font-bold uppercase tracking-wide text-[#52617a]">
                                Or register with email
                            </span>
                            <div className="h-px flex-1 bg-[#d9e0eb]" />
                        </div>

                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-3.5 sm:grid-cols-2">
                                <Field
                                    label="First Name"
                                    icon={User}
                                    placeholder="Jane"
                                    error={errors.firstName?.message}
                                    {...register('firstName')}
                                />
                                <Field
                                    label="Last Name"
                                    icon={User}
                                    placeholder="Doe"
                                    error={errors.lastName?.message}
                                    {...register('lastName')}
                                />
                            </div>

                            <Field
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                placeholder="jane.doe@company.com"
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            <div>
                                <Field
                                    label="Password"
                                    icon={LockKeyhole}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    error={errors.password?.message}
                                    rightElement={
                                        <button
                                            type="button"
                                            className="text-[#8490a4] transition hover:text-[#17233a]"
                                            onClick={() => setShowPassword((value) => !value)}
                                            aria-label={
                                                showPassword ? 'Hide password' : 'Show password'
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    }
                                    {...register('password')}
                                />
                                <div className="mt-1.5 flex items-center gap-1">
                                    {[1, 2, 3, 4].map((step) => (
                                        <span
                                            key={step}
                                            className={cn(
                                                'h-1 flex-1 rounded-full bg-[#c6cfde]',
                                                step <= strength.score && 'bg-[#0b6ff9]',
                                            )}
                                        />
                                    ))}
                                    <span className="ml-2 w-12 text-right text-xs font-semibold text-[#52617a]">
                                        {strength.label}
                                    </span>
                                </div>
                            </div>

                            <Field
                                label="Confirm Password"
                                icon={LockKeyhole}
                                type="password"
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword')}
                            />

                            <Button
                                type="submit"
                                className="h-10 w-full bg-[#0b6ff9] text-sm font-bold text-white hover:bg-[#075fd9]"
                                disabled={isBusy}
                            >
                                {isBusy ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <p className="mt-4 text-center text-sm text-[#52617a]">
                            Already have an account?
                            <Link
                                to="/login"
                                className="ml-1 font-bold text-[#0b6ff9] underline-offset-4 hover:underline"
                            >
                                Login
                            </Link>
                        </p>

                        <p className="mx-auto mt-4 max-w-[330px] text-center text-xs font-medium leading-4 text-[#52617a]">
                            By creating an account, you agree to our{' '}
                            <Link to="/terms" className="font-bold underline underline-offset-2">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="font-bold underline underline-offset-2">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </section>
            </div>

            <DataModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate('/login');
                }}
                title="Registration Successful"
                description="Verify your email to continue"
                size="md"
                showHeader
                showFooter
                closeButtonText="Go to Login"
            >
                <div className="flex flex-col items-center px-4 py-6 text-center">
                    <div className="mb-5 rounded-full bg-[#e3efff] p-4">
                        <Mail className="h-8 w-8 text-[#0b6ff9]" />
                    </div>
                    <p className="text-base font-semibold text-foreground">
                        Please check your inbox and verify your email.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        We sent a verification link to{' '}
                        <span className="font-semibold text-foreground">{registeredEmail}</span>.
                    </p>
                    <div className="my-5 h-px w-full bg-border" />
                    <p className="max-w-sm text-sm text-muted-foreground">
                        Your registration was successful. Open the email and click the verification
                        link before signing in.
                    </p>
                </div>
            </DataModal>
        </main>
    );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon: ComponentType<{ className?: string }>;
    error?: string;
    rightElement?: ReactNode;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(
    ({ label, icon: Icon, error, rightElement, className, ...props }, ref) => (
        <label className="block">
            <span className="mb-0.5 block text-xs font-bold text-[#17233a]">{label}</span>
            <span
                className={cn(
                    'flex h-9 items-center rounded-md border border-[#cbd5e5] bg-white px-3 transition focus-within:border-[#0b6ff9] focus-within:ring-2 focus-within:ring-[#0b6ff9]/15',
                    error && 'border-red-300 focus-within:border-red-500 focus-within:ring-red-100',
                )}
            >
                <Icon className="mr-2 h-4 w-4 shrink-0 text-[#8490a4]" />
                <input
                    ref={ref}
                    className={cn(
                        'h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#17233a] outline-none placeholder:text-[#b7c1d2]',
                        className,
                    )}
                    {...props}
                />
                {rightElement}
            </span>
            {error && <span className="mt-0.5 block text-xs font-medium text-red-600">{error}</span>}
        </label>
    ),
);
Field.displayName = 'Field';
