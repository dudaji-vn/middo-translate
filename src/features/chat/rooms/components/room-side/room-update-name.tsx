import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';
import { useId, useRef, useState } from 'react';

import { Input } from '@/components/data-entry';
import { useTranslation } from 'react-i18next';
import { useChatBox } from '../../contexts';
import { useUpdateRoomInfo } from '../../hooks/use-update-room-info';

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('CONVERSATION.CHANGE_STATION_NAME')}
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
