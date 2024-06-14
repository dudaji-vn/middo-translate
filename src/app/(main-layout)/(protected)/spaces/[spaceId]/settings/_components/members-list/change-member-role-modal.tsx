import { useMemo, useState } from 'react';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useChangeRoleMember } from '@/features/business-spaces/hooks/use-change-role-member';
import { ESPaceRoles } from '../space-setting/setting-items';
import customToast from '@/utils/custom-toast';

export const ChangeMemberRoleModal = ({
  _id,
  email,
  role,
  onClosed = () => {},
  onCancel = () => {},
  onSucceed = () => {},
  onFailed = () => {},
}: {
  _id: string;
  role: ESPaceRoles;
  email: string;
  onClosed: () => void;
  onCancel: () => void;
  onSucceed: () => void;
  onFailed: () => void;
}) => {
  const { mutateAsync, isLoading } = useChangeRoleMember();
  const { t } = useTranslation('common');
  const params = useParams();

  const onConfirm = async () => {
    mutateAsync({
      email,
      role,
      spaceId: String(params?.spaceId),
    })
      .then(() => {
        onSucceed();
      })
      .catch((err) => {
        onFailed();
        customToast.error(
          err?.response?.data?.message ||
            'Failed to change role member. Please try again later.',
        );
      })
      .finally(() => {
        onClosed();
      });
  };

  return (
    <ConfirmAlertModal
      title={`${t('MODAL.ROLE_CHANGE.TITLE')}`}
      open
      onConfirm={onConfirm}
      titleProps={{ className: 'capitalize' }}
      onCancel={() => {
        onCancel();
        onClosed?.();
      }}
      actionProps={{
        className:
          'bg-primary-500-main text-white active:!bg-primary-400 md:hover:bg-primary-600',
      }}
      isLoading={isLoading}
    >
      <span
        dangerouslySetInnerHTML={{
          __html: t('MODAL.ROLE_CHANGE.DESCRIPTION', { name: email, role }),
        }}
      ></span>
    </ConfirmAlertModal>
  );
};
