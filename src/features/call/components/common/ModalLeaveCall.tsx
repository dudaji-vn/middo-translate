
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import { useVideoCallStore } from '../../store';
import { useRouter } from 'next/navigation';

export const ConfirmLeaveRoomModal = () => {
    const router = useRouter();
    const { confirmLeave, setConfirmLeave } = useVideoCallStore();

    const handleLeave = async () => {
        setConfirmLeave(false);
        router.back();
    };

    const closeModal = () => {
        setConfirmLeave(false);
    };

    return (
        <AlertDialog open={confirmLeave} onOpenChange={closeModal}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to leave meeting?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className='block mt-5'>You will be leave this meeting. And another people will be continue this meeting.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                        onClick={handleLeave}
                    >
                        Leave
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
