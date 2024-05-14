import { Maximize2, Minimize2, Phone } from 'lucide-react';
import React, { useCallback } from 'react';
import { Button } from '@/components/actions';
import { useVideoCallStore } from '../../store/video-call.store';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { useTranslation } from 'react-i18next';

export default function VideoCallHeader() {
  const {t} = useTranslation('common')

  const room = useVideoCallStore((state) => state.room);
  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);
  const setFullScreen = useVideoCallStore((state) => state.setFullScreen);
  
  const toggleFullScreen =  useCallback(() => {
    setFullScreen(!isFullScreen);
  }, [setFullScreen, isFullScreen]);

  useKeyboardShortcut([SHORTCUTS.MAXIMIZE_MINIMIZE_CALL], toggleFullScreen);
  
  return (
    <div
      className={`flex items-center gap-1 bg-primary-100 py-2 pl-3 pr-1 text-primary ${
        !isFullScreen && 'cursor-grab active:cursor-grabbing'
      }`}
    >
      <Phone className="h-4 w-4 stroke-current" />
      <span className="line-clamp-1 flex-1 font-semibold">{room?.name}</span>
      <Tooltip
        title={isFullScreen ? t('TOOL_TIP.MINIMIZE') : t('TOOL_TIP.MAXIMIZE')}
        triggerItem={
          <Button.Icon
            variant="default"
            color="default"
            size="xs"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize2 /> : <Maximize2 />}
          </Button.Icon>
        }
      />
    </div>
  );
}
