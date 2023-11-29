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
} from '@/components/feedback/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/actions/dropdown-menu';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/actions/button';
import { MoreHorizontalOutline } from '@easy-eva-icons/react';
import { Room } from '../../types';
import { roomApi } from '@/features/chat/rooms/api';
import { useMutation } from '@tanstack/react-query';

// import {
//   ArrowLeftOnRectangleIcon,
//   EllipsisHorizontalIcon,
//   TrashIcon,
// } from '@heroicons/react/24/solid';

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
                size="sm"
                variant="default"
                color="default"
                className="border shadow"
              >
                <MoreHorizontalOutline />
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
                    {/* <TrashIcon className="mr-2 h-4 w-4" /> */}
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
                    {/* <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" /> */}
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
              <AlertDialogCancel className="hover:bg-slate-400">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
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
