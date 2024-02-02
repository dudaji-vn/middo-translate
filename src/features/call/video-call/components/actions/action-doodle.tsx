import { DropdownMenuItem } from '@/components/data-display';
import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import { useVideoCallContext } from '@/features/call/context/video-call-context';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { Brush } from 'lucide-react';
import React, { useMemo } from 'react';
import useHaveShareScreen from '../../hooks/use-have-share-screen';

export default function ActionDoodle() {
  const {
    isFullScreen,
    layout,
    isPinShareScreen,
    isDoodle,
    isMeDoole,
    setDrawing,
    isDrawing,
  } = useVideoCallStore();
  const { handleStartDoodle } = useVideoCallContext();

  const haveShareScreen = useHaveShareScreen()
  
  const onDoodle = () => {
    if (!isDoodle && isMeDoole) return;
    // Start doodle
    if (haveShareScreen && !isDoodle) {
      setDrawing(true);
      handleStartDoodle();
    }
    // Toggle drawing
    if (isDoodle) {
      setDrawing(!isDrawing);
    }
  };
  return (
    <DropdownMenuItem
      disabled={
        !haveShareScreen ||
        !isFullScreen ||
        !isPinShareScreen ||
        layout != VIDEOCALL_LAYOUTS.FOCUS_VIEW
      }
      onClick={onDoodle}
    >
      <Brush />
      <span className="ml-2">Screen Doodle</span>
    </DropdownMenuItem>
  );
}
