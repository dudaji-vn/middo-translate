import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { Phone, Video, VideoOff } from 'lucide-react';
import React, { memo } from 'react';

const ActionLeaveCall = () => {
  const { setConfirmLeave } = useVideoCallStore();
  const handleLeave = () => {
    setConfirmLeave(true);
  };
  return (
    <Tooltip
      title={'Leave call'}
      triggerItem={
        <Button.Icon
          variant="default"
          size="xs"
          color="error"
          title="Leave"
          onClick={handleLeave}
        >
          <Phone className="rotate-[135deg]" />
        </Button.Icon>
      }
    />
  );
};

export default memo(ActionLeaveCall);
