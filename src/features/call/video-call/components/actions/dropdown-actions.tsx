import { Button } from '@/components/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { CALL_TYPE } from '@/features/call/constant/call-type';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { MoreVertical, UserPlus2 } from 'lucide-react';
import ActionToggleCaption from './action-toggle-caption';
import ActionDoodle from './action-doodle';
import ActionToggleLayout from './action-toggle-layout';
import { useMemo, useState } from 'react';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import { useVideoCallContext } from '@/features/call/context/video-call-context';
import useHaveShareScreen from '../../hooks/use-have-share-screen';

enum SHORTCUT_TOGGLE_ACTIONS {
  GALLERY = 'g',
  DOODLE = 'e',
  CAPTION = 'l',
  ADD_MEMBER = 'a',
}
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

  const actionShortcutKeysSet = Object.values(SHORTCUT_TOGGLE_ACTIONS).map(
    (value) => [value],
  );
  useKeyboardShortcut(actionShortcutKeysSet, (e) => {
    if (!e || !isFullScreen) return;
    const { key, shiftKey } = e;
    if (shiftKey) return;
    switch (key) {
      case SHORTCUT_TOGGLE_ACTIONS.GALLERY:
        setLayout(VIDEOCALL_LAYOUTS.GALLERY_VIEW);
        break;
      case SHORTCUT_TOGGLE_ACTIONS.DOODLE:
        onDoodle();
        break;
      case SHORTCUT_TOGGLE_ACTIONS.CAPTION:
        setShowCaption(!isShowCaption);
        break;
      case SHORTCUT_TOGGLE_ACTIONS.ADD_MEMBER:
        setModalAddUser(!isShowModalAddUser);
        break;
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
