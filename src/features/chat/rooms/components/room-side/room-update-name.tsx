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

import { Input } from '@/components/data-entry';
import { useTranslation } from 'react-i18next';
import { useChatBox } from '../../contexts';
import { useUpdateRoomInfo } from '../../hooks/use-update-room-info';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/actions';
import { Camera, PenIcon } from 'lucide-react';

export interface RoomUpdateNameProps {}

export const RoomUpdateName = (props: RoomUpdateNameProps) => {
  const { room } = useChatBox();
  const [newName, setNewName] = useState(room.name || '');
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useUpdateRoomInfo();
  const { t } = useTranslation('common');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;
    mutate({
      roomId: room._id,
      data: {
        name: name.trim(),
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button.Icon
          size="xs"
          color="secondary"
          type="button"
          className="shrink-0"
        >
          <PenIcon />
        </Button.Icon>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('CONVERSATION.CHANGE_GROUP_NAME')}
          </AlertDialogTitle>
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
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={
              newName.trim() === room.name ||
              (!room.isSetName && newName.trim() === '')
            }
            form={id}
            type="submit"
          >
            {t('COMMON.UPDATE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
