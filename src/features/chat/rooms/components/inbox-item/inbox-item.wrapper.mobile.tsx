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
import { LogOut, Trash } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';

import { Button } from '@/components/actions';
import { Room } from '../../types';
import { roomApi } from '../../api';
import { useBoolean } from 'usehooks-ts';
import { useInboxItem } from './inbox-item';
import { useLongPress } from 'use-long-press';
import { useMutation } from '@tanstack/react-query';

export interface InboxItemMobileWrapperProps {
  room: Room;
}
const selectOptionsMap = {
  delete: {
    label: 'Delete',
    title: 'Delete room?',
    description: 'You will lose all of your messages and files in this room.',
    mutation: roomApi.deleteRoom,
  },
  leave: {
    title: 'Leave room?',
    label: 'Leave',
    description: 'You will lose all of your messages and files in this room.',
    mutation: roomApi.leaveRoom,
  },
};

export const InboxItemMobileWrapper = ({
  children,
}: InboxItemMobileWrapperProps & PropsWithChildren) => {
  const { data } = useInboxItem();
  const { setFalse, setTrue, toggle, value } = useBoolean(false);
  const bind = useLongPress(() => {
    setTrue();
  });
  const [selected, setSelected] = useState<'delete' | 'leave'>('delete');
  const { mutateAsync } = useMutation({
    mutationFn: selectOptionsMap[selected].mutation,
  });
  return (
    <>
      <div {...bind()} className="w-full">
        {children}
      </div>
      {value && (
        <AlertDialog>
          <div className="fixed left-0 top-0 z-50 flex h-screen w-screen flex-col bg-black/60">
            <div onClick={setFalse} className="flex-1"></div>
            <div className="absolute bottom-0 z-10 w-full overflow-hidden rounded-t-3xl border-t bg-background pb-3">
              <div className="mx-auto my-3 h-1 w-8 rounded-full bg-colors-neutral-100"></div>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={() => {
                    setSelected('leave');
                  }}
                  startIcon={<LogOut className="h-4 w-4" />}
                  color="default"
                  variant="ghost"
                  shape="square"
                  size="lg"
                  className="w-full rounded-none"
                >
                  Leave
                </Button>
              </AlertDialogTrigger>
              <div className="h-[1px] w-full bg-colors-neutral-50"></div>

              <AlertDialogTrigger asChild>
                <Button
                  onClick={() => {
                    setSelected('delete');
                  }}
                  startIcon={<Trash className="h-4 w-4" />}
                  color="error"
                  variant="ghost"
                  shape="square"
                  size="lg"
                  className="w-full rounded-none"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>

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
                  <AlertDialogCancel className="sm:mr-3">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    type="submit"
                    className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                    onClick={() => {
                      mutateAsync(data._id);
                    }}
                  >
                    {selectOptionsMap[selected].label}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </div>
          </div>
        </AlertDialog>
      )}
    </>
  );
};
