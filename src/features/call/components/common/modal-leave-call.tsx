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
import { useRouter } from 'next/navigation';
import { useVideoCallStore } from '../../store/video-call.store';
import { useParticipantVideoCallStore } from '../../store/participant.store';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';

export const ConfirmLeaveRoomModal = () => {
  const router = useRouter();
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
