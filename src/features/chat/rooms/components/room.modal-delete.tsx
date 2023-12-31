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

export interface RoomModalDeleteProps {
  id: string;
  onClosed?: () => void;
}

export const RoomModalDelete = (props: RoomModalDeleteProps) => {
  const { mutateAsync } = useMutation({
    mutationFn: roomApi.deleteRoom,
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
          <AlertDialogTitle>
            Are you sure you want to delete this room?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will lose all of your messages and files in this room.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={() => {
              mutateAsync(props.id);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
