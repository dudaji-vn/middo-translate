import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { useDeleteForm } from '@/features/conversation-forms/hooks/use-delete-form';
import customToast from '@/utils/custom-toast';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';

const DeleteFormModal = ({
  onclose,
  open,
  formIds = [],
}: {
  open: boolean;
  onclose: () => void;
  formIds?: string[];
}) => {
  const spaceId = useParams()?.spaceId as string;
  const { title, description, idsToDelete } = useMemo(() => {
    return {
      title: 'Delete selected forms',
      description: `Are you sure you want to delete selected form?`,
      idsToDelete: formIds,
    };
  }, [formIds]);

  const { mutateAsync, isLoading } = useDeleteForm();
  const onSubmit = async () => {
    try {
      await mutateAsync({ spaceId, formIds: idsToDelete });
      onclose();
    } catch (error: unknown) {
      console.log(error);
      // @ts-ignore
      const msg = error?.response?.data?.message || error?.message;
      customToast.error(msg || `Fail to delete form`);
      console.error(error);
    }
  };
  return (
    <ConfirmAlertModal
      title={title}
      description={description}
      open={open}
      onConfirm={onSubmit}
      onCancel={onclose}
      cancelProps={{
        disabled: isLoading,
      }}
      actionProps={{
        disabled: isLoading,
        children: 'Delete',
      }}
    />
  );
};

export default DeleteFormModal;
