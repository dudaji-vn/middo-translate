import { DropdownMenuItem } from '@/components/data-display';
import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import { useVideoCallContext } from '@/features/call/context/video-call-context';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { Brush } from 'lucide-react';
import React, { useMemo } from 'react';
import useHaveShareScreen from '../../hooks/use-have-share-screen';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';

const SHORTCUT_TOGGLE_DOODLE = ['e'];
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

  const haveShareScreen = useHaveShareScreen();

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
  const isDoodleDisabled = useMemo(() => {
    return (
      !haveShareScreen ||
      !isFullScreen ||
      !isPinShareScreen ||
      layout != VIDEOCALL_LAYOUTS.FOCUS_VIEW
    );
  }, [haveShareScreen, isFullScreen, isPinShareScreen, layout]);

  useKeyboardShortcut([SHORTCUT_TOGGLE_DOODLE], () => {
    if (!isDoodleDisabled) {
      onDoodle();
    }
  });

  return (
    <DropdownMenuItem disabled={isDoodleDisabled} onClick={onDoodle}>
      <Brush />
      <span className="ml-2">Screen Doodle</span>
    </DropdownMenuItem>
  );
}
