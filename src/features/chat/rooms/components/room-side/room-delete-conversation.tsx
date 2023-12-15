import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/feedback';
import { LogOut, Trash2 } from 'lucide-react';

import { Button } from '@/components/actions';
import { useDeleteConversation } from '../../hooks/use-delete-conversation';
import { useLeaveRoom } from '../../hooks/use-leave-room';

export interface RoomDeleteConversationProps {
  roomId: string;
}

export const RoomDeleteConversation = ({
  roomId,
}: RoomDeleteConversationProps) => {
  const { mutate } = useDeleteConversation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          startIcon={<Trash2 className="h-4 w-4 text-colors-error-400-main" />}
          shape="square"
          color="default"
          size="lg"
          className="w-full rounded-t-[4px]"
        >
          <span className="text-colors-error-400-main">
            Delete conversation
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete conversation ?</AlertDialogTitle>
          <AlertDialogDescription>
            Once you delete your copy of this conversation, it cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={() => {
              mutate(roomId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
