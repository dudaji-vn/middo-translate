import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { Phone, Video, VideoOff } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const ActionLeaveCall = () => {
  const {t} = useTranslation('common')

  const setModal = useVideoCallStore(state => state.setModal);
  const handleLeave = () => {
    setModal('leave-call')
  };
  return (
    <Tooltip
      title={t('TOOL_TIP.LEAVE_CALL')}
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
