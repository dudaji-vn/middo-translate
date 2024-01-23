
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useVideoCallStore } from '../../store/video-call.store';
import { useAuthStore } from '@/stores/auth.store';
import { JOIN_TYPE } from '../../constant/call-type';

export const ModalSwitchRoom = () => {
    const { user } = useAuthStore();
    const { tmpRoom, setTempRoom, setRoom } = useVideoCallStore()

    const handleSwitch = () => {
        setRoom(tmpRoom?.call);
        setTempRoom(null);
        if(tmpRoom.type == JOIN_TYPE.NEW_CALL) {
            const participants = tmpRoom?.room?.participants.filter((p:any) => p._id !== user?._id).map((p:any) => p._id);
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.STARTING_NEW_CALL, {
                participants,
                call: tmpRoom?.call,
                user: user,
            });
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_JOIN_ROOM, { roomId: tmpRoom?._id, user});
        }
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
