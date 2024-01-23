
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';

interface ModalConfirmClearDoodleProps {
    isOpen: boolean;
    toggleModal: () => void;
    handleSubmit: () => void;
}
export const ModalConfirmClearDoodle = ({ isOpen, toggleModal, handleSubmit }: ModalConfirmClearDoodleProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={() => toggleModal()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Clear doodle?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span>
                            Your doodle will be clear and can not be undo. Are you sure to clear your doodle?
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                        onClick={() => handleSubmit()}
                    >
                        Clear
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
