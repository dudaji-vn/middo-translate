import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';

import { roomApi } from '../api';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export interface RoomModalLeaveProps {
  id: string;
  onClosed?: () => void;
}

export const RoomModalLeave = (props: RoomModalLeaveProps) => {
  const { mutateAsync } = useMutation({
    mutationFn: roomApi.leaveRoom,
  });
  const {t} = useTranslation('common')
  return (
    <AlertDialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          props.onClosed?.();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('MODAL.LEAVE_GROUP.TITLE')}</AlertDialogTitle>
          <AlertDialogDescription className="dark:text-neutral-50">
            {t('MODAL.LEAVE_GROUP.DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">{t('COMMON.CANCEL')}</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            onClick={() => {
              mutateAsync(props.id);
            }}
          >
            {t('COMMON.LEAVE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
