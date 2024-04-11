
import { Room, RoomStatus } from '../types';
import { useChangeStatusConversation } from '../hooks/use-change-status-conversation';
import { useMemo, useState } from 'react';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { AlertDialogActionProps } from '@radix-ui/react-alert-dialog';
import { useRouter } from 'next/navigation';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { ROUTE_NAMES } from '@/configs/route-name';
import toast from 'react-hot-toast';


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


export const RoomModalChangeStatus = ({ id, actionName, onClosed }: RoomModalChangeStatusProps) => {
  const { mutateAsync, isLoading } = useChangeStatusConversation();
  const [open, setOpen] = useState(true);
  const { businessConversationType } = useBusinessNavigationData();
  const router = useRouter();
  const {
    modalTitle,
    modalDescription,
  } = useMemo(() => {
    setOpen(true);
    return {
      modalTitle: `${actionName} Conversation`,
      modalDescription: `Are you sure to ${actionName} this conversation?`,
    }
  }, [actionName, id]);
  const onConfirm = async () => {
    mutateAsync({ roomId: id, status: MAPPED_ACTION_STATUS[actionName] }).then(() => {
      router.push(`${ROUTE_NAMES.BUSINESS_SPACE}/${businessConversationType}`);
    }).catch(() => {
      toast.error(`Failed to ${actionName} conversation!`);
    }).finally(() => {
      setOpen(false);
    });
  }

  if (!MAPPED_ACTION_STATUS[actionName]) return null;
  return (
    <ConfirmAlertModal
      title={modalTitle}
      description={modalDescription}
      open={open}
      onConfirm={onConfirm}
      titleProps={{ className: 'capitalize' }}
      onCancel={() => { onClosed?.(); }}
      actionProps={{
        className: 'bg-primary-500-main text-white active:!bg-primary-400 md:hover:bg-primary-600',
      }}
      isLoading={isLoading}
    />
  );
};
