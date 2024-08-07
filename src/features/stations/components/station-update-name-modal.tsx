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
import { Typography } from '@/components/data-display';
import { useId, useRef, useState } from 'react';
import { Button } from '@/components/actions';
import { Input } from '@/components/data-entry';
import { AlertCircleIcon, Pen } from 'lucide-react';
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
            isError={newName.length > 30}
          />
          {newName.length > 30 && (
            <div className="mt-2 flex flex-row items-center gap-3 text-sm font-medium text-destructive">
              <AlertCircleIcon className="h-7 w-5 min-w-[20px] " />
              <Typography className="text-sm text-red-500">
                {t('STATION.ERRORS.NAME_MAX_LENGTH')}
              </Typography>
            </div>
          )}
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
            disabled={
              !newName.trim() ||
              newName.trim() === station.name ||
              newName.length > 30
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
