
import { Room, RoomStatus } from '../types';
import { useChangeStatusConversation } from '../hooks/use-change-status-conversation';
import { useMemo, useState } from 'react';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { AlertDialogActionProps } from '@radix-ui/react-alert-dialog';


export interface RoomModalChangeStatusProps {
  id: Room['_id'];
  onClosed?: () => void;
  actionName: string;
}
const MAPPED_ACTION_STATUS: Record<string, RoomStatus> = {
  'archive': 'archived',
  'unarchive': 'active',
  'complete': 'completed',
}
const actionVariants: Record<string, AlertDialogActionProps['className']> = {
  'archive': 'bg-orange-500 text-background active:!bg-orange-400 md:hover:bg-orange-600',
  'unarchive': 'bg-primary-500-main text-white active:!bg-primary-400 md:hover:bg-primary-600',
  'complete': 'bg-primary-500-main text-white active:!bg-primary-400 md:hover:bg-primary-600',
}

export const RoomModalChangeStatus = ({ id, actionName, onClosed }: RoomModalChangeStatusProps) => {
  const { mutateAsync } = useChangeStatusConversation();
  const [open, setOpen] = useState(true);
  const {
    modalTitle,
    modalDescription,
  } = useMemo(() => {
    return {
      modalTitle: `${actionName} Conversation`,
      modalDescription: `Are you sure to ${actionName} this conversation?`,
    }
  }, [actionName, id]);

  if (!MAPPED_ACTION_STATUS[actionName]) return null;
  return (
    <ConfirmAlertModal
      title={modalTitle}
      description={modalDescription}
      open={open}
      onConfirm={() => {
        mutateAsync({ roomId: id, status: MAPPED_ACTION_STATUS[actionName] });
        setOpen(false);
      }}
      titleProps={{ className: 'capitalize' }}
      onCancel={() => { onClosed?.(); }}
      actionProps={{
        className: actionVariants[actionName] || '',
      }}
    />
  );
};
