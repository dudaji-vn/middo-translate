import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { CALL_TYPE } from '@/features/call/constant/call-type';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { UserPlus2 } from 'lucide-react';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const ActionAddMembers = () => {
  const {t} = useTranslation('common')

  const call = useVideoCallStore((state) => state.call);
  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);
  const setModal = useVideoCallStore((state) => state.setModal);
  const modal = useVideoCallStore((state) => state.modal);
  const toggleModalAddUser = useCallback(()=> {
    setModal(modal == 'add-user' ? undefined : 'add-user')
  },[modal, setModal])
  useKeyboardShortcut([SHORTCUTS.ADD_MEMBERS], () => {
    toggleModalAddUser()
  });

  if(isFullScreen || call?.type !== CALL_TYPE.GROUP) return null

  return (
    <Tooltip
      title={t('TOOL_TIP.ADD_MEMBER')}
      triggerItem={
        <Button.Icon
          variant="default"
          size="xs"
          color={'default'}
          onClick={() => toggleModalAddUser()}
        >
          <UserPlus2 />
        </Button.Icon>
      }
    />
  );
};

export default memo(ActionAddMembers);
