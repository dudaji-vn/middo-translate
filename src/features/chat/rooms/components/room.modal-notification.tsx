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

const modalContentMap = {
  turnOn: {
    title: 'Turn on notifications',
    description: 'You will receive notifications for new messages.',
  },
  turnOff: {
    title: 'Turn off notifications',
    description: 'You will not receive notifications for new messages.',
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
            {modalContentMap[props.type].title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {modalContentMap[props.type].description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            onClick={() => {
              mutateAsync(props.id);
            }}
          >
            {props.type === 'turnOn' ? 'Turn on' : 'Turn off'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
