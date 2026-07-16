import { useState } from 'react';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import {
    resendVerificationSchema,
    type ResendVerificationFormData,
} from '@/validations/authValidation';
import type { FormFieldConfig } from '@/components/forms/types';
import { authService } from '@/services';
import { showToast } from '@/lib/toast';



const resendFields: FormFieldConfig[] = [
    {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email address',
        required: true,
    },
];

const defaultValues: ResendVerificationFormData = {
    email: '',
};

export default function ResendVerification() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: ResendVerificationFormData) => {
        setLoading(true);

        try {
            await authService.resendVerification(data);
            showToast('Verification email sent successfully!', 'success');
        } catch (error: unknown) {
            const message =
                (error as { message?: string }).message ?? 'Failed to resend verification email';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <CardTitle className="text-xl">Resend Verification Email</CardTitle>
                <CardDescription>
                    Enter your email address to receive a new verification link
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DynamicForm<ResendVerificationFormData>
                    schema={resendVerificationSchema}
                    defaultValues={defaultValues}
                    fields={resendFields}
                    onSubmit={handleSubmit}
                    submitButtonText={loading ? 'Sending...' : 'Send Verification Email'}
                    validationMode="onChange"
                />
            </CardContent>
        </Card>
    );
}
