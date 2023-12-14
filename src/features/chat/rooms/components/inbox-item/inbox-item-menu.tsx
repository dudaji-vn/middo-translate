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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/actions/button';
import { MoreVertical } from 'lucide-react';
import { Room } from '../../types';
import { roomApi } from '@/features/chat/rooms/api';
import { useMutation } from '@tanstack/react-query';

export interface InboxItemMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  room: Room;
}

const selectOptionsMap = {
  delete: {
    label: 'Delete',
    title: 'Are you sure you want to delete this room?',
    description: 'You will lose all of your messages and files in this room.',
    mutation: roomApi.deleteRoom,
  },
  leave: {
    title: 'Are you sure you want to leave this room?',
    label: 'Leave',
    description: 'You will lose all of your messages and files in this room.',
    mutation: roomApi.leaveRoom,
  },
};

export const InboxItemMenu = forwardRef<HTMLDivElement, InboxItemMenuProps>(
  (props, ref) => {
    const [selected, setSelected] = useState<'delete' | 'leave'>('delete');
    const { mutateAsync } = useMutation({
      mutationFn: selectOptionsMap[selected].mutation,
    });
    return (
      <div ref={ref} {...props}>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button.Icon
                size="md"
                variant="default"
                color="default"
                className="border shadow"
              >
                <MoreVertical />
              </Button.Icon>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {!props.room.isGroup ? (
                <AlertDialogTrigger
                  onClick={() => {
                    setSelected('delete');
                  }}
                  className="w-full"
                >
                  <DropdownMenuItem>
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              ) : (
                <AlertDialogTrigger
                  onClick={() => {
                    setSelected('leave');
                  }}
                  className="w-full"
                >
                  <DropdownMenuItem>
                    <span>Leave</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectOptionsMap[selected].title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectOptionsMap[selected].description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                onClick={() => {
                  mutateAsync(props.room._id);
                }}
              >
                {selectOptionsMap[selected].label}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  },
);
InboxItemMenu.displayName = 'InboxItemMenu';
