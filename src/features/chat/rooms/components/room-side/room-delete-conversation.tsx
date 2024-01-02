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

import { Button } from '@/components/actions';
import { Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDeleteConversation } from '../../hooks/use-delete-conversation';

export interface RoomDeleteConversationProps {
  roomId: string;
  isGroup?: boolean;
}

export const RoomDeleteConversation = ({
  isGroup,
  roomId,
}: RoomDeleteConversationProps) => {
  const { mutate } = useDeleteConversation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          startIcon={<Trash2 className="text-colors-error-400-main h-4 w-4" />}
          shape="square"
          color="default"
          size="lg"
          className={cn('w-full ', isGroup ? 'rounded-t-[4px]' : '-mt-4')}
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
