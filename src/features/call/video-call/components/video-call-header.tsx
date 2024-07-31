import { Maximize2, Minimize2, Phone } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/actions';
import { useVideoCallStore } from '../../store/video-call.store';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { useTranslation } from 'react-i18next';
import useHelpDesk from '../../hooks/use-help-desk';
import { cn } from '@/utils/cn';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
interface VideoCallHeaderProps {
  isShowFullScreenButton: boolean;
}
export default function VideoCallHeader({isShowFullScreenButton}:VideoCallHeaderProps ) {
  const { t } = useTranslation('common');
  const ref = React.useRef<HTMLDivElement>(null);
  const call = useVideoCallStore((state) => state.call);
  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);
  const setFullScreen = useVideoCallStore((state) => state.setFullScreen);
  // const setAllowDrag = useVideoCallStore((state) => state.setAllowDrag);
  const toggleFullScreen = useCallback(() => {
    setFullScreen(!isFullScreen);
  }, [setFullScreen, isFullScreen]);

  useKeyboardShortcut([SHORTCUTS.MAXIMIZE_MINIMIZE_CALL], toggleFullScreen);

  // useEffect(() => {
  //   if (!ref) return;
  //   const enableDrag = () => {
  //     setAllowDrag(true);
  //   };
  //   const disableDrag = () => {
  //     setAllowDrag(false);
  //   };
  //   ref.current?.addEventListener('mouseenter', enableDrag);
  //   ref.current?.addEventListener('mouseleave', disableDrag);

  //   return () => {
  //     ref.current?.removeEventListener('mouseenter', enableDrag);
  //     ref.current?.removeEventListener('mouseleave', disableDrag);
  //   };
  // }, [setAllowDrag]);

  return (
    <div
      className={`flex cursor-grab items-center gap-1 bg-primary-100 py-2 pl-3 pr-1 text-primary active:cursor-grabbing dark:bg-neutral-900`}
      ref={ref}
    >
      <Phone className="h-4 w-4 stroke-current" />
      <span className="line-clamp-1 flex-1 font-semibold">{call?.name}</span>
      {isShowFullScreenButton && 
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
    }
    </div>
  );
}
