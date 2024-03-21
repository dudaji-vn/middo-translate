import { DropdownMenuItem } from '@/components/data-display';
import { VIDEOCALL_LAYOUTS } from '@/features/call/constant/layout';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { LayoutGrid } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const ActionToggleLayout = () =>  {
  const { layout, setLayout } = useVideoCallStore();
  const {t} = useTranslation('common')
  const changeLayout = () => {
    setLayout(VIDEOCALL_LAYOUTS.GALLERY_VIEW);
  };
  return (
    <DropdownMenuItem
      disabled={layout == VIDEOCALL_LAYOUTS.GALLERY_VIEW}
      onClick={changeLayout}
    >
      <LayoutGrid />
      <span className="ml-2">{t('CONVERSATION.GALERY_VIEW')}</span>
    </DropdownMenuItem>
  );
}

export default memo(ActionToggleLayout);