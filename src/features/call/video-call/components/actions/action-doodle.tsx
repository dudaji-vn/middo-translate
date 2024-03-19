import { DropdownMenuItem } from '@/components/data-display';
import { Brush } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ActionDoodle({
  disabled = false,
  onDoodle,
}: {
  disabled?: boolean;
  onDoodle: () => void;
}) {
  const {t} = useTranslation('common')
  return (
    <DropdownMenuItem disabled={disabled} onClick={onDoodle}>
      <Brush />
      <span className="ml-2">{t('CONVERSATION.SCREEN_DOODLE')}</span>
    </DropdownMenuItem>
  );
}
