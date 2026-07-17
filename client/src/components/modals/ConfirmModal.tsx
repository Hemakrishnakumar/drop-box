import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';



export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger' | 'success' | 'info';
    icon?: ReactNode;
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    icon,
    isLoading = false,
}: ConfirmModalProps) {
    const Icon = variant === 'danger' ? AlertTriangle : variant === 'success' ? CheckCircle : Info;
    const iconTone =
        variant === 'danger'
            ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300'
            : variant === 'success'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={message}
            footer={
                <>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === 'danger' ? 'destructive' : 'default'}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </>
            }
        >
            {(icon || variant !== 'default') && (
                <div className={`inline-flex rounded-xl p-2.5 ${iconTone}`}>
                    {icon ?? <Icon className="h-5 w-5" />}
                </div>
            )}
        </Modal>
    );
}
