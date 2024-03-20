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
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { USE_IS_MUTED_ROOM_QUERY_KEY } from '../hooks/use-is-muted-room';
import { notificationApi } from '@/features/notification/api';
import { useTranslation } from 'react-i18next';

const modalContentMap = {
  turnOn: {
    title: 'MODAL.NOTIFICATION.ON.TITLE',
    description: 'MODAL.NOTIFICATION.ON.DESCRIPTION',
  },
  turnOff: {
    title: 'MODAL.NOTIFICATION.OFF.TITLE',
    description: 'MODAL.NOTIFICATION.OFF.DESCRIPTION',
  },
};

export interface RoomModalNotificationProps {
  id: string;
  onClosed?: () => void;
  type: 'turnOn' | 'turnOff';
}

export const RoomModalNotification = (props: RoomModalNotificationProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: notificationApi.toggleRoomNotification,
    onSuccess: () => {
      queryClient.invalidateQueries([USE_IS_MUTED_ROOM_QUERY_KEY, props.id]);
    },
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
          <AlertDialogTitle>
            {t(modalContentMap[props.type].title)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(modalContentMap[props.type].description)}
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
            {props.type === 'turnOn' ? t('MODAL.NOTIFICATION.ON.TITLE') : t('MODAL.NOTIFICATION.OFF.TITLE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
