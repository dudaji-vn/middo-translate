import { AlertDialogActionProps, AlertDialogCancelProps, AlertDialogContentProps, AlertDialogProps, AlertDialogTitleProps } from '@radix-ui/react-alert-dialog';
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
import useClient from '@/hooks/use-client';


export const ConfirmAlertModal = ({
    header,
    title,
    description,
    open,
    onOpenChange,
    onConfirm = () => { },
    onCancel = () => { },
    dialogContentProps,
    headerProps,
    descriptionProps,
    titleProps,
    footerProps,
    actionProps,
    cancelProps,
    dialogProps,
    children,
    footer,
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onConfirm?: () => void,
    onCancel?: () => void,
    title?: string | React.ReactNode,
    description?: string | React.ReactNode,
    dialogProps?: Omit<AlertDialogProps, 'open' | 'onOpenChange'>,
    dialogContentProps?: AlertDialogContentProps,
    headerProps?: React.HTMLAttributes<HTMLDivElement>,
    descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>,
    titleProps?: React.HTMLAttributes<HTMLParagraphElement>,
    actionProps?: AlertDialogActionProps,
    cancelProps?: AlertDialogCancelProps,
    footerProps?: React.HTMLAttributes<HTMLDivElement>,
    children?: React.ReactNode,
    header?: React.ReactNode,
    footer?: React.ReactNode,
} & AlertDialogProps) => {
    const isClient = useClient();

    if (!isClient) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
            <AlertDialogContent {...dialogContentProps}>
                <AlertDialogHeader {...headerProps}>
                    {header || <>
                        <AlertDialogTitle {...titleProps}>
                            {title}
                        </AlertDialogTitle>
                        <AlertDialogDescription {...descriptionProps}>
                            {description}
                        </AlertDialogDescription>
                    </>}
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter {...footerProps} >
                    {footer || <>
                        <AlertDialogCancel
                            {...cancelProps}
                            onClick={(e) => { onCancel(); cancelProps?.onClick?.(e) }}
                            className={cn("sm:mr-3", cancelProps?.className)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            {...actionProps}
                            onClick={(e) => { onConfirm(); actionProps?.onClick?.(e) }}
                            className={cn('bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter',
                                actionProps?.className)}
                        >
                            Yes
                        </AlertDialogAction>
                    </>}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    );
};
