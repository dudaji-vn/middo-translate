import { DropdownMenuItem } from '@/components/data-display';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { ScanText } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ActionToggleCaption() {
  const {t} = useTranslation('common')
  const isShowCaption = useVideoCallStore((state) => state.isShowCaption);
  const setShowCaption = useVideoCallStore((state) => state.setShowCaption);
  return (
    <DropdownMenuItem
      onClick={() => setShowCaption(!isShowCaption)}
      className={isShowCaption ? 'bg-primary-200' : ''}
    >
      <ScanText />
      <span className="ml-2">{t('CONVERSATION.CAPTION')}</span>
    </DropdownMenuItem>
  );
}
