import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { useDeleteScript } from '@/features/conversation-scripts/hooks/use-delete-script';
import { TChatScript } from '@/types/scripts.type';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';

const DeleteScriptModal = ({
  onclose,
  open,
  scriptIds = [],
}: {
  open: boolean;
  onclose: () => void;
  scriptIds?: string[];
}) => {
  const spaceId = useParams()?.spaceId as string;
  const { title, description, idsToDelete } = useMemo(() => {
    return {
      title: 'Delete selected scripts',
      description: `Are you sure you want to delete ${scriptIds.length} script${scriptIds.length > 1 ? 's' : ''}?`,
      idsToDelete: scriptIds,
    };
  }, [scriptIds]);

  const { mutateAsync, isLoading } = useDeleteScript();
  const onSubmit = async () => {
    try {
      await mutateAsync({ spaceId, scriptIds: idsToDelete });
      onclose();
    } catch (error: unknown) {
      console.log(error);
      // @ts-ignore
      const msg = error?.response?.data?.message || error?.message;
      toast.error(msg || `Fail to delete script`);
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

export default DeleteScriptModal;
