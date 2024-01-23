
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
                        Are you sure you want to clear your doodle?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className='block mt-5'>
                            You will be clear your doodle.
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
