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
import  isEqual from 'lodash/isEqual';


export default function DropdownActions() {
  const {
    room,
    isDoodle,
    isMeDoole,
    isShowModalAddUser,
    layout,
    isPinShareScreen,
    setDrawing,
    isDrawing,
    isFullScreen,
    setModalAddUser,
    isShowCaption,
    setShowCaption,
    setLayout,
  } = useVideoCallStore();
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

  const actionShortcutKeysSet = [
    SHORTCUTS.SWITCH_TO_GALLERY_VIEW,
    SHORTCUTS.START_STOP_SCREEN_DOODLE,
    SHORTCUTS.TOGGLE_LIVE_CAPTION,
    SHORTCUTS.ADD_MEMBERS
  ]
  useKeyboardShortcut(actionShortcutKeysSet, (e, mathedKeys) => {
    if (!e || !isFullScreen) return;
    if(isEqual(mathedKeys, SHORTCUTS.SWITCH_TO_GALLERY_VIEW)) {
      setLayout(layout === VIDEOCALL_LAYOUTS.FOCUS_VIEW ? VIDEOCALL_LAYOUTS.GALLERY_VIEW : VIDEOCALL_LAYOUTS.FOCUS_VIEW);
      return;
    }
    if(isEqual(mathedKeys, SHORTCUTS.START_STOP_SCREEN_DOODLE)) {
      onDoodle();
      return;
    }
    if(isEqual(mathedKeys, SHORTCUTS.TOGGLE_LIVE_CAPTION)) {
      setShowCaption(!isShowCaption);
      return;
    }
    if(isEqual(mathedKeys, SHORTCUTS.ADD_MEMBERS)) {
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
      <DropdownMenuContent>
        <ActionToggleLayout />
        <ActionDoodle disabled={isDoodleDisabled} onDoodle={onDoodle} />
        {room.type === CALL_TYPE.GROUP && (
          <DropdownMenuItem onClick={() => setModalAddUser(true)}>
            <UserPlus2 />
            <span className="ml-2">Add member</span>
          </DropdownMenuItem>
        )}
        <ActionToggleCaption />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
