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

import { useLeaveRoom } from '@/features/chat/rooms/hooks/use-leave-room';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Item } from '@/components/data-display';
import { useLeaveStation } from '../hooks/use-leave-station';

export interface RoomLeaveProps {
  roomId: string;
}

export const StationLeave = ({ roomId }: RoomLeaveProps) => {
  const { mutate } = useLeaveStation();
  const { t } = useTranslation('common');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Item danger leftIcon={<LogOut />} onClick={() => {}}>
          {t('CONVERSATION.LEAVE_STATION')}
        </Item>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('MODAL.LEAVE_STATION.TITLE')}?</AlertDialogTitle>
          <AlertDialogDescription className="dark:text-neutral-50">
            {t('MODAL.LEAVE_STATION.DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
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
