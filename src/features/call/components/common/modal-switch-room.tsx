
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useVideoCallStore } from '../../store/video-call';
import { useAuthStore } from '@/stores/auth';

export const ModalSwitchRoom = () => {
    const { tmpRoom, setTempRoom, setRoom } = useVideoCallStore()

    const handleSwitch = () => {
        setRoom(tmpRoom);
        setTempRoom(null);
    };

    return (
        <AlertDialog open={tmpRoom} onOpenChange={()=>setTempRoom(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to switch room?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className='block mt-5'>
                            You will be switch to room <strong>{tmpRoom?.name}</strong>.
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
