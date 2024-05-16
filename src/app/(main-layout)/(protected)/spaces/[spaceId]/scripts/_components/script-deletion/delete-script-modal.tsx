import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { useDeleteScript } from '@/features/conversation-scripts/hooks/use-delete-script';
import { TChatScript } from '@/types/scripts.type';
import { useParams } from 'next/navigation';
import React from 'react';

const DeleteScriptModal = ({
  script,
  onclose,
  open,
}: {
  script?: TChatScript;
  open: boolean;
  onclose: () => void;
}) => {
  const spaceId = useParams()?.spaceId as string;
  const { mutateAsync } = useDeleteScript();
  const onSubmit = async () => {
    if (!script) return;
    try {
      mutateAsync({ spaceId, scriptId: script?._id });
      onclose();
    } catch (error) {}
  };
  return (
    <ConfirmAlertModal
      title={`Delete script`}
      description={`Are you sure you want to delete the script ${script?.name}?`}
      open={open}
      onConfirm={onSubmit}
      onCancel={onclose}
    />
  );
};

export default DeleteScriptModal;
