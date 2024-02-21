import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { CALL_TYPE } from '@/features/call/constant/call-type';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { UserPlus2 } from 'lucide-react';
import React, { memo, useCallback } from 'react';
import { boolean } from 'yup';

const SHORTCUT_ADD_MEMBERS = ['a'];
const ActionAddMembers = () => {
  const { room, isFullScreen, setModalAddUser, isShowModalAddUser } = useVideoCallStore();

  useKeyboardShortcut([SHORTCUT_ADD_MEMBERS], () => {
    setModalAddUser(!isShowModalAddUser);
  });

  return (
    <Tooltip
      title={'Add members'}
      triggerItem={
        <Button.Icon
          variant="default"
          size="xs"
          color={'default'}
          className={`${
            isFullScreen || room.type !== CALL_TYPE.GROUP ? 'hidden' : ''
          }`}
          onClick={() => setModalAddUser(true)}
        >
          <UserPlus2 />
        </Button.Icon>
      }
    />
  );
};

export default memo(ActionAddMembers);
