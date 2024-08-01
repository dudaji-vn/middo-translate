import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';
import { useVideoCallStore } from '../../../store/video-call.store';
import { useParticipantVideoCallStore } from '../../../store/participant.store';
import { useElectron } from '@/hooks/use-electron';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
import { useTranslation } from 'react-i18next';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { signOutService } from '@/services/auth.service';

export const ModalLeaveCall = () => {
  const {t} = useTranslation('common');
  const setModal = useVideoCallStore(state => state.setModal);
  const modal = useVideoCallStore(state => state.modal)
  const setCall = useVideoCallStore(state => state.setCall);
  const participants = useParticipantVideoCallStore(state => state.participants);
  const removeParticipant = useParticipantVideoCallStore(state => state.removeParticipant);
  const { isHelpDesk } = useBusinessNavigationData();
  const { isElectron, ipcRenderer } = useElectron();
  const pathName = usePathname();
  const isAnonymousCallScreen = pathName?.includes('call');
  const handleLeave = async () => {
    setModal();
    participants.forEach((participant) => {
      if (!participant.isMe) {
        participant.peer?.destroy();
      }
      removeParticipant(participant.socketId);
    });
    setCall(undefined);
    if(isElectron) {
      ipcRenderer.send(ELECTRON_EVENTS.STOP_SHARE_SCREEN);
    }
    
    if(isHelpDesk) {
      window.close();
      return;
    }
    if(isAnonymousCallScreen) {
      window.location.href = '/';
      return;
    }
  };


  return (
    <AlertDialog open={modal == 'leave-call'} onOpenChange={() => setModal()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('MODAL.LEAVE_CALL.TITLE')}
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-neutral-50">
            <span>
              {t('MODAL.LEAVE_CALL.DESCRIPTION')}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">{t('COMMON.CANCEL')}</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={handleLeave}
          >
            {t('COMMON.LEAVE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
