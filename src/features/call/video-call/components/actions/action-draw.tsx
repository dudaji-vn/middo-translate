import { Button } from '@/components/actions';
import { Brush } from 'lucide-react';
import React, { useMemo } from 'react';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import useHaveShareScreen from '../../hooks/use-have-share-screen';
import { VIDEO_CALL_LAYOUTS } from '@/features/call/constant/layout';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useTranslation } from 'react-i18next';

export default function ActionDraw({}: {}) {
  const {t} = useTranslation('common')

  const setDrawing = useVideoCallStore((state) => state.setDrawing);
  const isDrawing = useVideoCallStore((state) => state.isDrawing);
  const layout = useVideoCallStore((state) => state.layout);
  const isPinShareScreen = useVideoCallStore((state) => state.isPinShareScreen);
  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);

  const haveShareScreen = useHaveShareScreen();
  
  const participants = useParticipantVideoCallStore((state) => state.participants);
  const participantShareScreen = useMemo(() => {
    return participants.find((p) => p.isShareScreen);
  }, [participants]);

  const participantPin = useMemo(() => {
    return participants.find((p) => p.pin);
  }, [participants]);

  const isDoodleDisabled = useMemo(() => {
    return (
      !haveShareScreen ||
      !isFullScreen ||
      !isPinShareScreen ||
      layout != VIDEO_CALL_LAYOUTS.FOCUS_VIEW ||
      !participantShareScreen?.isElectron ||
      !participantPin?.isShareScreen
    );
  }, [haveShareScreen, isFullScreen, isPinShareScreen, layout, participantPin?.isShareScreen, participantShareScreen?.isElectron]);
  if(isDoodleDisabled) return null;
  return (
    <Tooltip
      title={t('TOOL_TIP.DOODLE')}
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
