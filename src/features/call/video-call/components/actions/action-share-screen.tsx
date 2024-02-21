import { Button } from '@/components/actions';
import { useVideoCallContext } from '@/features/call/context/video-call-context';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { MonitorUp } from 'lucide-react';
import React, { memo } from 'react';
import useHaveShareScreen from '../../hooks/use-have-share-screen';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';

const SHORTCUT_SHARING_SCREEN = ['s'];
const ActionShareScreen = () => {
  const { isShareScreen } = useMyVideoCallStore();
  const { handleShareScreen } = useVideoCallContext();
  const haveShareScreen = useHaveShareScreen();
  useKeyboardShortcut([SHORTCUT_SHARING_SCREEN], handleShareScreen);
  return (
    <Tooltip
      title={isShareScreen ? 'Stop sharing screen' : 'Share screen'}
      triggerItem={
        <Button.Icon
          variant="default"
          size="xs"
          color={isShareScreen ? 'primary' : 'default'}
          disabled={haveShareScreen && !isShareScreen}
          onClick={handleShareScreen}
          id="share-screen"
        >
          <MonitorUp />
        </Button.Icon>
      }
    />
  );
};

export default memo(ActionShareScreen);
