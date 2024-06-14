import { Room, RoomStatus } from '../types';
import { useChangeStatusConversation } from '../hooks/use-change-status-conversation';
import { useMemo, useState } from 'react';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { AlertDialogActionProps } from '@radix-ui/react-alert-dialog';
import { useParams, useRouter } from 'next/navigation';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { ROUTE_NAMES } from '@/configs/route-name';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import customToast from '@/utils/custom-toast';

export interface RoomModalChangeStatusProps {
  id: Room['_id'];
  onClosed?: () => void;
  actionName: string;
}
const MAPPED_ACTION_STATUS: Record<string, RoomStatus> = {
  archive: 'archived',
  unarchive: 'active',
};

export const RoomModalChangeStatus = ({
  id,
  actionName,
  onClosed,
}: RoomModalChangeStatusProps) => {
  const { mutateAsync, isLoading } = useChangeStatusConversation();
  const [open, setOpen] = useState(true);
  const { businessConversationType } = useBusinessNavigationData();
  const { t } = useTranslation('common');
  const router = useRouter();
  const params = useParams();
  const { modalTitle, modalDescription } = useMemo(() => {
    setOpen(true);
    return {
      modalTitle: t(`MODAL.CHANGE_ROOM_STATUS.TITLE`, {
        action: t(`COMMON.${actionName?.toUpperCase()}`),
      }),
      modalDescription: t(`MODAL.CHANGE_ROOM_STATUS.DESCRIPTION`, {
        action: t(`COMMON.${actionName?.toUpperCase()}`),
      }),
    };
  }, [actionName, id]);
  const onConfirm = async () => {
    mutateAsync({ roomId: id, status: MAPPED_ACTION_STATUS[actionName] })
      .then(() => {
        router.push(
          `${ROUTE_NAMES.SPACES}/${params?.spaceId}/${businessConversationType}`,
        );
      })
      .catch(() => {
        customToast.error(
          t('MODAL.CHANGE_ROOM_STATUS.FAILED_TO', {
            action: t(`COMMON.${actionName?.toUpperCase()}`),
          }),
        );
      })
      .finally(() => {
        setOpen(false);
      });
  };

  if (!MAPPED_ACTION_STATUS[actionName]) return null;
  return (
    <ConfirmAlertModal
      title={modalTitle}
      description={modalDescription}
      open={open}
      onConfirm={onConfirm}
      titleProps={{ className: 'capitalize' }}
      onCancel={() => {
        onClosed?.();
      }}
      actionProps={{
        className:
          'bg-primary-500-main text-white active:!bg-primary-400 md:hover:bg-primary-600',
      }}
      isLoading={isLoading}
    />
  );
};
