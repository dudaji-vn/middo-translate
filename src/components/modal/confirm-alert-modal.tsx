import { AlertDialogContentProps, AlertDialogProps, AlertDialogTitleProps } from '@radix-ui/react-alert-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../feedback';
import { cn } from '@/utils/cn';


export const ConfirmmAlertModal = ({
    open, onOpenChange,
    title = `You didn't save your changes`,
    description,
    onConfirm,
    onCancel,
    dialogContentProps,
    headerProps,
    descriptionProps,
    footerProps,
    actionProps,
    cancelProps,
    dialogProps,
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    title: string | React.ReactNode,
    description: string | React.ReactNode,
    onConfirm: () => void,
    onCancel: () => void,
    dialogProps?: Omit<AlertDialogProps, 'open' | 'onOpenChange'>,
    dialogContentProps?: AlertDialogContentProps,
    headerProps?: React.HTMLAttributes<HTMLDivElement>,
    descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>,
    actionProps?: React.HTMLAttributes<HTMLButtonElement>,
    cancelProps?: Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'>,
    footerProps?: React.HTMLAttributes<HTMLDivElement>,
} & AlertDialogProps) => {

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
            <AlertDialogContent {...dialogContentProps}>
                <AlertDialogHeader {...headerProps}>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription {...descriptionProps}>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter {...footerProps} >
                    <AlertDialogCancel {...cancelProps} className={cn("sm:mr-3", cancelProps?.className)} onClick={onCancel} >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        {...actionProps}
                        className={cn('bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter',
                            actionProps?.className)}
                        onClick={onConfirm}
                    >
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    );
};
