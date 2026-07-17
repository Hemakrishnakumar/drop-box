import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';



type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
    footer?: ReactNode;
    size?: ModalSize;
    className?: string;
    bodyClassName?: string;
    showHeader?: boolean;
    showCloseButton?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-[90vw]',
};

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    className,
    bodyClassName,
    showHeader = true,
    showCloseButton = true,
}: ModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                hideCloseButton
                className={cn(
                    'max-h-[calc(100vh-2rem)] gap-0 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-0 shadow-2xl shadow-slate-950/15 dark:border-slate-700/80 dark:bg-[#111b2e] dark:text-slate-200 dark:shadow-black/40',
                    sizeClasses[size],
                    className,
                )}
                onInteractOutside={(event) => event.preventDefault()}
                onEscapeKeyDown={onClose}
            >
                {showHeader ? (
                    <DialogHeader className="border-b border-slate-100 px-5 py-4 text-left dark:border-slate-700/80">
                        <DialogTitle className="pr-8 text-lg font-bold text-slate-900 dark:text-slate-200">
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className="pt-1 text-left text-slate-500 dark:text-slate-400">
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                ) : (
                    <DialogTitle className="sr-only">{title ?? 'Dialog'}</DialogTitle>
                )}

                {showCloseButton && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="absolute right-4 top-3.5 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0061ff]/30 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                <div className={cn('min-h-0 overflow-y-auto px-5 py-5', bodyClassName)}>
                    {children}
                </div>

                {footer && (
                    <DialogFooter className="border-t border-slate-100 px-5 py-4 dark:border-slate-700/80">
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
