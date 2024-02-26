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

export const ConfirmLeaveRoomModal = () => {
  const { confirmLeave, setConfirmLeave, setRoom, room } = useVideoCallStore();
  const { participants, removeParticipant } = useParticipantVideoCallStore();

  const handleLeave = async () => {
    setConfirmLeave(false);
    participants.forEach((participant) => {
      if (!participant.isMe) {
        participant.peer?.destroy();
      }
      removeParticipant(participant.socketId);
    });
    setRoom(null);
  };

  const closeModal = () => {
    setConfirmLeave(false);
  };

  return (
    <AlertDialog open={confirmLeave} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Leave call?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span>
              You will leave this call and other still continue. Are you sure to leave?
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={handleLeave}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
