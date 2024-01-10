import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import { useRouter } from 'next/navigation';
import { useVideoCallStore } from '../../store/video-call';
import { useParticipantVideoCallStore } from '../../store/participant';

export const ConfirmLeaveRoomModal = () => {
    const router = useRouter();
    const { confirmLeave, setConfirmLeave, setRoom } = useVideoCallStore();
    const { participants, removeParticipant } = useParticipantVideoCallStore();

    const handleLeave = async () => {
        setConfirmLeave(false);
        participants.forEach(participant => {
            if (!participant.isMe) {
                participant.peer?.destroy();
            }
            removeParticipant(participant.socketId);
        })
        setRoom(null)
    };

    const closeModal = () => {
        setConfirmLeave(false);
    };

    return (
        <AlertDialog open={confirmLeave} onOpenChange={closeModal}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to leave meeting?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className='block mt-5'>You will be leave this meeting. And another people will be continue this meeting.</span>
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
