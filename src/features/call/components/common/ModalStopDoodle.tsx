
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import { useVideoCallStore } from '../../store';
import { useRouter } from 'next/navigation';

export const ConfirmStopDoodle = () => {
    const { confirmStopDoodle, setConfirmStopDoodle, setDoodle, setDoodleImage, setDrawing } = useVideoCallStore();
    const handleStop = () => {
        setDrawing(false);
        setDoodle(false);
        setDoodleImage("");
    };

    return (
        <AlertDialog open={confirmStopDoodle} onOpenChange={()=>setConfirmStopDoodle(false)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to stop doodle?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className='block mt-5'>
                            You and other participants will be stop doodle.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                        onClick={handleStop}
                    >
                        Stop
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
