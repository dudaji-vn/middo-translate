import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { CALL_TYPE } from '@/features/call/constant/call-type';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { UserPlus2 } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const ActionAddMembers = () => {
  const {t} = useTranslation('common')

  const room = useVideoCallStore((state) => state.room);
  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);
  const setModalAddUser = useVideoCallStore((state) => state.setModalAddUser);
  const isShowModalAddUser = useVideoCallStore((state) => state.isShowModalAddUser);
    
  useKeyboardShortcut([SHORTCUTS.ADD_MEMBERS], () => {
    setModalAddUser(!isShowModalAddUser);
  });

  if(isFullScreen || room.type !== CALL_TYPE.GROUP) return null

  return (
    <Tooltip
      title={t('TOOL_TIP.ADD_MEMBER')}
      triggerItem={
        <Button.Icon
          variant="default"
          size="xs"
          color={'default'}
          onClick={() => setModalAddUser(true)}
        >
          <UserPlus2 />
        </Button.Icon>
      }
    />
  );
};

export default memo(ActionAddMembers);
