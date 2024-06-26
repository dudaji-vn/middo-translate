import { DropdownMenuItem } from '@/components/data-display';
import { VIDEO_CALL_LAYOUTS } from '@/features/call/constant/layout';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { LayoutGrid } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const ActionToggleLayout = () =>  {
  const {t} = useTranslation('common')

  const layout = useVideoCallStore((state) => state.layout);
  const setLayout = useVideoCallStore((state) => state.setLayout);
  
  const changeLayout = () => {
    setLayout(VIDEO_CALL_LAYOUTS.GALLERY_VIEW);
  };
  return (
    <DropdownMenuItem
      disabled={layout == VIDEO_CALL_LAYOUTS.GALLERY_VIEW}
      onClick={changeLayout}
      className='dark:hover:bg-neutral-800'
    >
      <LayoutGrid />
      <span className="ml-2">{t('CONVERSATION.GALLERY_VIEW')}</span>
    </DropdownMenuItem>
  );
}

export default memo(ActionToggleLayout);