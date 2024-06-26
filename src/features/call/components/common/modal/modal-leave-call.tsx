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

export const ConfirmLeaveRoomModal = () => {
  const {t} = useTranslation('common');

  const confirmLeave = useVideoCallStore(state => state.confirmLeave);
  const setConfirmLeave = useVideoCallStore(state => state.setConfirmLeave);
  const setRoom = useVideoCallStore(state => state.setRoom);
  const participants = useParticipantVideoCallStore(state => state.participants);
  const removeParticipant = useParticipantVideoCallStore(state => state.removeParticipant);
  const { isHelpDesk } = useBusinessNavigationData();
  const { isElectron, ipcRenderer } = useElectron();
  
  const handleLeave = async () => {
    setConfirmLeave(false);
    participants.forEach((participant) => {
      if (!participant.isMe) {
        participant.peer?.destroy();
      }
      removeParticipant(participant.socketId);
    });
    setRoom();
    if(isElectron) {
      ipcRenderer.send(ELECTRON_EVENTS.STOP_SHARE_SCREEN);
    }

    // Check if is help desk call => close window
    if(isHelpDesk) {
      window.close();
    }
  };

  const closeModal = () => {
    setConfirmLeave(false);
  };

  return (
    <AlertDialog open={confirmLeave} onOpenChange={closeModal}>
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
