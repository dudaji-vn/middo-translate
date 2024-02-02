import { Button } from '@/components/actions';
import { useVideoCallContext } from '@/features/call/context/video-call-context';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { MonitorUp } from 'lucide-react';
import React, { memo, useMemo } from 'react';
import useHaveShareScreen from '../../hooks/use-have-share-screen';

const ActionShareScreen = () => {
  const { isShareScreen } = useMyVideoCallStore();
  const { handleShareScreen } = useVideoCallContext();
  const haveShareScreen = useHaveShareScreen()
  return (
    <Button.Icon
      variant="default"
      size="xs"
      color={isShareScreen ? 'primary' : 'default'}
      disabled={haveShareScreen && !isShareScreen}
      onClick={handleShareScreen}
    >
      <MonitorUp />
    </Button.Icon>
  );
};

export default memo(ActionShareScreen);
