import { AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';



export interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    errorCode?: string | number;
    showCloseButton?: boolean;
    closeButtonText?: string;
    variant?: 'error' | 'warning';
}

export default function ErrorModal({
    isOpen,
    onClose,
    title = 'An Error Occurred',
    message = 'Something went wrong. Please try again later.',
    errorCode,
    showCloseButton = true,
    closeButtonText = 'Close',
    variant = 'error',
}: ErrorModalProps) {
    const Icon = variant === 'error' ? XCircle : AlertCircle;
    const iconTone =
        variant === 'error'
            ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300'
            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={message}
            footer={
                showCloseButton ? (
                    <Button
                        type="button"
                        variant={variant === 'error' ? 'destructive' : 'outline'}
                        onClick={onClose}
                    >
                        {closeButtonText}
                    </Button>
                ) : undefined
            }
        >
            <div className={`inline-flex rounded-xl p-2.5 ${iconTone}`}>
                <Icon className="h-5 w-5" />
            </div>
            {errorCode && (
                <p className="mt-4 inline-flex rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Error Code: {errorCode}
                </p>
            )}
        </Modal>
    );
}
