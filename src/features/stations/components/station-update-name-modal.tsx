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
import { useTranslation } from 'react-i18next';
import { Station } from '../types/station.types';
import { useUpdateStation } from '../hooks/use-update-station';

export interface StationUpdateNameProps {
  station: Station;
  onClosed?: () => void;
}

export const StationUpdateName = ({
  station,
  onClosed,
}: StationUpdateNameProps) => {
  const [newName, setNewName] = useState(station.name || '');
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate } = useUpdateStation();
  const { t } = useTranslation('common');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;
    mutate({
      stationId: station._id,
      data: {
        name: name.trim(),
      },
    });
  };

  return (
    <AlertDialog
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          onClosed?.();
        }
      }}
    >
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
              setNewName(station.name || '');
            }}
            className="mr-4"
          >
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={newName.trim() === station.name}
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
