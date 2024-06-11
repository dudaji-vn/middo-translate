
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import { useVideoCallStore } from '../../../store/video-call.store';
import { useTranslation } from 'react-i18next';
import { useJoinCall } from '@/features/chat/rooms/hooks/use-join-call';

export const ModalSwitchRoom = () => {
    const {t} = useTranslation('common');
    
    const tmpRoom = useVideoCallStore(state => state.tmpRoom);
    const setTempRoom = useVideoCallStore(state => state.setTempRoom);
    
    const startVideoCall = useJoinCall();
    const handleSwitch = () => {
        if(!tmpRoom) return;
        startVideoCall(tmpRoom)
        setTempRoom(null);
    };

    return (
        <AlertDialog open={!!tmpRoom} onOpenChange={()=>setTempRoom(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('MODAL.SWITCH_ROOM.TITLE')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-neutral-50">
                        <span>{t('MODAL.SWITCH_ROOM.DESCRIPTION')}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        onClick={()=>setTempRoom(null)}                        
                        className="sm:mr-3">
                        {t('COMMON.CANCEL')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                        onClick={handleSwitch}
                    >
                        {t('COMMON.SWITCH')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
