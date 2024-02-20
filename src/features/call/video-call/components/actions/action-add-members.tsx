import { Button } from '@/components/actions';
import { CALL_TYPE } from '@/features/call/constant/call-type';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { UserPlus2 } from 'lucide-react';
import React, { memo } from 'react';

const ActionAddMembers = () => {
  const { room, isFullScreen, setModalAddUser } = useVideoCallStore();
 
  return (
    <Button.Icon
      variant="default"
      size="xs"
      color={'default'}
      // disabled={haveShareScreen && !isShareScreen}
      className={`${
        isFullScreen || room.type !== CALL_TYPE.GROUP ? 'hidden' : ''
      }`}
      onClick={() => setModalAddUser(true)}
    >
      <UserPlus2 />
    </Button.Icon>
  );
};

export default memo(ActionAddMembers);
