import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { showToast } from '@/lib/toast';



interface GoogleSignInButtonProps {
    mode: 'signin' | 'signup';
}

export function GoogleSignInButton({ mode }: GoogleSignInButtonProps) {
    const navigate = useNavigate();
    const { googleSignIn, loading } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSuccess = async ({ credential }: CredentialResponse) => {
        if (!credential) {
            showToast('Google did not return a sign-in credential. Please try again.', 'error');
            return;
        }

        try {
            setIsProcessing(true);
            await googleSignIn({ token: credential });
            navigate('/', { replace: true });
        } catch {
            // AuthContext records the error for the surrounding form.
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div
            className={`flex justify-center ${loading || isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        >
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => showToast('Google sign-in was cancelled or failed.', 'error')}
                theme="outline"
                size="large"
                shape="rectangular"
                text={mode === 'signup' ? 'signup_with' : 'continue_with'}
                width="355"
            />
        </div>
    );
}
