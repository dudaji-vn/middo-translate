import { Button } from '@/components/actions';
import { Brush } from 'lucide-react';
import React, { useMemo } from 'react';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import useHaveShareScreen from '../../hooks/use-have-share-screen';
import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';

export default function ActionDraw({}: {}) {
  const {
    setDrawing,
    isDrawing,
    layout,
    isPinShareScreen,
    isFullScreen,
  } = useVideoCallStore();
  const haveShareScreen = useHaveShareScreen();
  const isDoodleDisabled = useMemo(() => {
    return (
      !haveShareScreen ||
      !isFullScreen ||
      !isPinShareScreen ||
      layout != VIDEOCALL_LAYOUTS.FOCUS_VIEW
    );
  }, [haveShareScreen, isFullScreen, isPinShareScreen, layout]);

  if(isDoodleDisabled) return null;
  return (
    <Tooltip
      title={'Doodle'}
      triggerItem={
        <Button.Icon
          variant="default"
          size="xs"
          color={isDrawing ? 'primary' : 'default'}
          onClick={() => setDrawing(!isDrawing)}
        >
          <Brush />
        </Button.Icon>
      }
    />
  );
}
