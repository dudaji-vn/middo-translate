import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useVideoCallStore } from '../../../store/video-call.store';
import { useParticipantVideoCallStore } from '../../../store/participant.store';
import { useTranslation } from 'react-i18next';

export const RequestJoinRoomModal = () => {
    const {t} = useTranslation('common');

    const call = useVideoCallStore(state => state.call);
    const usersRequestJoinRoom = useParticipantVideoCallStore(state => state.usersRequestJoinRoom);
    const removeUsersRequestJoinRoom = useParticipantVideoCallStore(state => state.removeUsersRequestJoinRoom);
    
    const handleReject = async () => {
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.REJECT_JOIN_ROOM, {socketId: usersRequestJoinRoom[0].socketId});
        removeUsersRequestJoinRoom(usersRequestJoinRoom[0].socketId);
    };
    const handleAccept = async () => {
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.ACCEPT_JOIN_ROOM, {socketId: usersRequestJoinRoom[0].socketId, roomInfo: call});
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
                        {t('MODAL.REQUEST_JOIN_ROOM.TITLE', {name: usersRequestJoinRoom[0].user.name})}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-neutral-50">
                        <span className="block mt-5">{t('MODAL.REQUEST_JOIN_ROOM.DESCRIPTION')}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">{t('COMMON.CANCEL')}</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                        onClick={handleReject}
                    >
                        {t('COMMON.REJECT')}
                    </AlertDialogAction>
                    <AlertDialogAction
                        type="submit"
                        className="bg-primary text-background active:!bg-primary-darker md:hover:bg-primary-lighter"
                        onClick={handleAccept}
                    >
                        {t('COMMON.ACCEPT')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
