import { Button } from '@/components/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { CALL_TYPE } from '@/features/call/constant/call-type';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { MoreVertical, UserPlus2 } from 'lucide-react';
import ActionToggleCaption from './action-toggle-caption';
import ActionDoodle from './action-doodle';
import ActionToggleLayout from './action-toggle-layout';
import { useMemo } from 'react';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import { useVideoCallContext } from '@/features/call/context/video-call-context';
import useHaveShareScreen from '../../hooks/use-have-share-screen';
import { SHORTCUTS } from '@/types/shortcuts';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';
import ActionVideoAudioSetting from './action-video-audio-setting';


export default function DropdownActions() {

  const room = useVideoCallStore((state) => state.room);
  const isDoodle = useVideoCallStore((state) => state.isDoodle);
  const isMeDoodle = useVideoCallStore((state) => state.isMeDoodle);
  const isShowModalAddUser = useVideoCallStore((state) => state.isShowModalAddUser);
  const layout = useVideoCallStore((state) => state.layout);
  const isPinShareScreen = useVideoCallStore((state) => state.isPinShareScreen);
  const setDrawing = useVideoCallStore((state) => state.setDrawing);
  const isDrawing = useVideoCallStore((state) => state.isDrawing);
  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);
  const setModalAddUser = useVideoCallStore((state) => state.setModalAddUser);
  const isShowCaption = useVideoCallStore((state) => state.isShowCaption);
  const setShowCaption = useVideoCallStore((state) => state.setShowCaption);
  const setLayout = useVideoCallStore((state) => state.setLayout);

  const { handleStartDoodle } = useVideoCallContext();

  const haveShareScreen = useHaveShareScreen();

  const isDoodleDisabled = useMemo(() => {
    return (
      !haveShareScreen ||
      !isFullScreen ||
      !isPinShareScreen ||
      layout != VIDEOCALL_LAYOUTS.FOCUS_VIEW
    );
  }, [haveShareScreen, isFullScreen, isPinShareScreen, layout]);
  const { t } = useTranslation('common')
  const onDoodle = () => {
    if (!isDoodle && isMeDoodle) return;
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

  const actionShortcutKeysSet = [
    SHORTCUTS.SWITCH_TO_GALLERY_VIEW,
    SHORTCUTS.START_STOP_SCREEN_DOODLE,
    SHORTCUTS.TOGGLE_LIVE_CAPTION,
    SHORTCUTS.ADD_MEMBERS
  ]
  useKeyboardShortcut(actionShortcutKeysSet, (e, matchedKeys) => {
    if (!e || !isFullScreen) return;
    if (isEqual(matchedKeys, SHORTCUTS.SWITCH_TO_GALLERY_VIEW)) {
      setLayout(layout === VIDEOCALL_LAYOUTS.FOCUS_VIEW ? VIDEOCALL_LAYOUTS.GALLERY_VIEW : VIDEOCALL_LAYOUTS.FOCUS_VIEW);
      return;
    }
    if (isEqual(matchedKeys, SHORTCUTS.START_STOP_SCREEN_DOODLE)) {
      onDoodle();
      return;
    }
    if (isEqual(matchedKeys, SHORTCUTS.TOGGLE_LIVE_CAPTION)) {
      setShowCaption(!isShowCaption);
      return;
    }
    if (isEqual(matchedKeys, SHORTCUTS.ADD_MEMBERS)) {
      setModalAddUser(!isShowModalAddUser);
      return;
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button.Icon
          variant="default"
          size="xs"
          color="default"
          className={`${!isFullScreen ? 'hidden' : ''}`}
        >
          <MoreVertical />
        </Button.Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='dark:bg-neutral-900 dark:border-neutral-800'>
        <ActionToggleLayout />
        <ActionDoodle disabled={isDoodleDisabled} onDoodle={onDoodle} />
        {room?.type === CALL_TYPE.GROUP && (
          <DropdownMenuItem onClick={() => setModalAddUser(true)} className='dark:hover:bg-neutral-800'>
            <UserPlus2 />
            <span className="ml-2">{t('CONVERSATION.ADD_MEMBER')}</span>
          </DropdownMenuItem>
        )}
        <ActionToggleCaption />
        <ActionVideoAudioSetting />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
