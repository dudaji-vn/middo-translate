
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import { useRouter } from 'next/navigation';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useVideoCallStore } from '../../store/video-call';
import { useParticipantVideoCallStore } from '../../store/participant';

export const RequestJoinRoomModal = () => {
    const { room } = useVideoCallStore();
    const { usersRequestJoinRoom, removeUsersRequestJoinRoom } = useParticipantVideoCallStore()

    const handleReject = async () => {
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.REJECT_JOIN_ROOM, {socketId: usersRequestJoinRoom[0].socketId});
        removeUsersRequestJoinRoom(usersRequestJoinRoom[0].socketId);
    };
    const handleAccept = async () => {
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.ACCEPT_JOIN_ROOM, {socketId: usersRequestJoinRoom[0].socketId, roomInfo: room});
        removeUsersRequestJoinRoom(usersRequestJoinRoom[0].socketId);
    };

    const closeModal = () => {
        removeUsersRequestJoinRoom(usersRequestJoinRoom[0].socketId);
    };

    if(usersRequestJoinRoom.length == 0) return null;
    return (
        <AlertDialog open={usersRequestJoinRoom.length > 0} onOpenChange={closeModal}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {usersRequestJoinRoom[0].user.name} want to join this meeting
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className="block mt-5">This user is not in this meeting. Do you want to accept this user join this meeting?</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                        onClick={handleReject}
                    >
                        Reject
                    </AlertDialogAction>
                    <AlertDialogAction
                        type="submit"
                        className="bg-primary text-background active:!bg-primary-darker md:hover:bg-primary-lighter"
                        onClick={handleAccept}
                    >
                        Accept
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
