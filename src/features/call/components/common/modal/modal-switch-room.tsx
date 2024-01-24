
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import { useVideoCallStore } from '../../../store/video-call.store';

export const ModalSwitchRoom = () => {
    const { tmpRoom, setTempRoom, setRoom } = useVideoCallStore()

    const handleSwitch = () => {
        setRoom(tmpRoom?.call);
        setTempRoom(null);
    };

    return (
        <AlertDialog open={tmpRoom} onOpenChange={()=>setTempRoom(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Switch room?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span>
                            You will be switch to room <strong>{tmpRoom?.call?.name}</strong>.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                        onClick={handleSwitch}
                    >
                        Switch
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
