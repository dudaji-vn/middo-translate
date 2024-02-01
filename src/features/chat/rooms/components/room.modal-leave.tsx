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

import { roomApi } from '../api';
import { useMutation } from '@tanstack/react-query';

export interface RoomModalLeaveProps {
  id: string;
  onClosed?: () => void;
}

export const RoomModalLeave = (props: RoomModalLeaveProps) => {
  const { mutateAsync } = useMutation({
    mutationFn: roomApi.leaveRoom,
  });
  return (
    <AlertDialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          props.onClosed?.();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave group?</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose all of your messages and files. Others still can see
            your messages. Are you sure to leave?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            onClick={() => {
              mutateAsync(props.id);
            }}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
