import { DropdownMenuItem } from '@/components/data-display';
import { Brush } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import IconScreenCapture from './components/icon-screen-capture';
export default function ActionDoodle({
  disabled = false,
  onDoodle,
}: {
  disabled?: boolean;
  onDoodle: () => void;
}) {

  const {t} = useTranslation('common')
  return (
    <DropdownMenuItem disabled={disabled} onClick={onDoodle} className='dark:hover:bg-neutral-800'>
      <IconScreenCapture />
      <span className="ml-2">{t('CONVERSATION.SCREEN_CAPTURE')}</span>
    </DropdownMenuItem>
  );
}
