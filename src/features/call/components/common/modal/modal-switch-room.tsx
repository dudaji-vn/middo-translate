
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import { useVideoCallStore } from '../../../store/video-call.store';
import { useTranslation } from 'react-i18next';

export const ModalSwitchRoom = () => {
    const { tmpRoom, setTempRoom, setRoom } = useVideoCallStore()
    const {t} = useTranslation('common');
    const handleSwitch = () => {
        setRoom(tmpRoom?.call);
        setTempRoom(null);
    };

    return (
        <AlertDialog open={tmpRoom} onOpenChange={()=>setTempRoom(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('MODAL.SWITCH_ROOM.TITLE')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span dangerouslySetInnerHTML={{__html: t('MODAL.SWITCH_ROOM.DESCRIPTION', {name: tmpRoom?.call?.name})}}></span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">{t('COMMON.CANCEL')}</AlertDialogCancel>
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
