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
import { useState } from 'react';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';

const SHORTCUT_TOGGLE_ACTIONS = [['g'], ['e'], ['l'], ['a']];
export default function DropdownActions() {
  const { room, isFullScreen, setModalAddUser } = useVideoCallStore();
  const  [openActions, setOpenActions] = useState(false);
  
  useKeyboardShortcut(SHORTCUT_TOGGLE_ACTIONS, (e) => {
    if(!e || !isFullScreen)  return;  
    setOpenActions(!openActions);
  })

  return (
    <DropdownMenu
      open={openActions}
      onOpenChange={setOpenActions}
    >
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
        <ActionDoodle />
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
