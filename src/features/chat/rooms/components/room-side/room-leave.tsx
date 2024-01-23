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
import { LogOut } from 'lucide-react';
import { useLeaveRoom } from '../../hooks/use-leave-room';

export interface RoomLeaveProps {
  roomId: string;
}

export const RoomLeave = ({ roomId }: RoomLeaveProps) => {
  const { mutate } = useLeaveRoom();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          startIcon={<LogOut className="h-4 w-4" />}
          shape="square"
          color="default"
          size="md"
          className="mb-1 w-full rounded-b-[4px]"
        >
          Leave group
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this group?</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose all of your messages and files in this room. Are you
            sure you want to leave this room?
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
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
