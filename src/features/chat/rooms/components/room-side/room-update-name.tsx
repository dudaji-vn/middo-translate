import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/feedback';
import { useId, useRef, useState } from 'react';

import { Button } from '@/components/actions';
import { Input } from '@/components/data-entry';
import { Pen } from 'lucide-react';
import { useChatBox } from '../../contexts';
import { useUpdateRoomInfo } from '../../hooks/use-update-room-info';

export interface RoomUpdateNameProps {}

export const RoomUpdateName = (props: RoomUpdateNameProps) => {
  const { room } = useChatBox();
  const [newName, setNewName] = useState(room.name || '');
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useUpdateRoomInfo();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;
    mutate({
      roomId: room._id,
      data: {
        name,
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button.Icon
          size="xs"
          onClick={() => {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }}
          color="secondary"
          type="button"
          className="shrink-0"
        >
          <Pen />
        </Button.Icon>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change group name</AlertDialogTitle>
        </AlertDialogHeader>
        <form id={id} onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
            ref={inputRef}
            name="name"
          />
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setNewName(room.name || '');
            }}
            className="mr-4"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={
              newName.trim() === room.name ||
              (!room.isSetName && newName.trim() === '')
            }
            form={id}
            type="submit"
          >
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
