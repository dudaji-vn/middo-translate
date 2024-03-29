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

import { Button } from '@/components/actions';
import { LogOut } from 'lucide-react';
import { useLeaveRoom } from '../../hooks/use-leave-room';
import { useTranslation } from 'react-i18next';

export interface RoomLeaveProps {
  roomId: string;
}

export const RoomLeave = ({ roomId }: RoomLeaveProps) => {
  const { mutate } = useLeaveRoom();
  const {t} = useTranslation('common');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          startIcon={<LogOut className="h-4 w-4" />}
          shape="square"
          color="default"
          size="md"
          className="mb-1 w-full rounded-b-[4px]"
        >
          {t('MODAL.LEAVE_ROOM.TITLE')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('MODAL.LEAVE_ROOM.TITLE')}?</AlertDialogTitle>
          <AlertDialogDescription>
          {t('MODAL.LEAVE_ROOM.DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">{t('COMMON.CANCEL')}</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={() => {
              mutate(roomId);
            }}
          >
            {t('COMMON.LEAVE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
