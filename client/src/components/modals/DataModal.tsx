import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';



export interface DataModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
    showCloseButton?: boolean;
    closeButtonText?: string;
    showHeader?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    scrollable?: boolean;
    showFooter?: boolean;
}

export default function DataModal({
    isOpen,
    onClose,
    title = 'Details',
    description,
    children,
    showCloseButton = true,
    closeButtonText = 'Close',
    showHeader = true,
    size = 'md',
    scrollable = true,
    showFooter = true,
}: DataModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            size={size}
            showHeader={showHeader}
            bodyClassName={scrollable ? undefined : 'overflow-visible'}
            footer={
                showFooter && showCloseButton ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        {closeButtonText}
                    </Button>
                ) : undefined
            }
        >
            {children}
        </Modal>
    );
}
