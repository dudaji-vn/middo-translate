
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useVideoCallStore } from '../../../store/video-call.store';
import { useAuthStore } from '@/stores/auth.store';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useTranslation } from 'react-i18next';

export const ModalStopDoodle = () => {
    const {t} = useTranslation('common');

    const setModal = useVideoCallStore(state => state.setModal);
    const modal = useVideoCallStore(state => state.modal);
    const setMeDoodle = useVideoCallStore(state => state.setMeDoodle);
    const user = useAuthStore(state => state.user);
    const setMyOldDoodle = useMyVideoCallStore(state => state.setMyOldDoodle);
    
    const handleStop = () => {
        setMeDoodle(false);
        setMyOldDoodle([])
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.END_DOODLE, user?.name);
    };

    return (
        <AlertDialog open={modal == 'stop-doodle'} onOpenChange={()=>setModal()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('MODAL.STOP_DOODLE.TITLE')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-neutral-50">
                        <span>{t('MODAL.STOP_DOODLE.DESCRIPTION')}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">{t('COMMON.CANCEL')}</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                        onClick={handleStop}
                    >
                        {t('COMMON.STOP')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
