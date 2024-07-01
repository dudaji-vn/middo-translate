import { Button } from '@/components/actions';
import { DropdownMenuItem } from '@/components/data-display';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { ScanText } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
interface ActionToggleCaptionProps {
  isInDropdown?: boolean;
}
export default function ActionToggleCaption({isInDropdown}: ActionToggleCaptionProps) {
  const {t} = useTranslation('common')
  const isShowCaption = useVideoCallStore((state) => state.isShowCaption);
  const setShowCaption = useVideoCallStore((state) => state.setShowCaption);

  if(isInDropdown) {
    return (
      <DropdownMenuItem
        onClick={() => setShowCaption(!isShowCaption)}
        className={isShowCaption ? 'bg-primary-200 dark:bg-primary-900 dark:text-primary' : 'dark:hover:bg-neutral-800'}
      >
        <ScanText />
        <span className="ml-2">{t('CONVERSATION.CAPTION')}</span>
      </DropdownMenuItem>
    );
  }

  return  <Button.Icon
      variant="default"
      size="xs"
      color={isShowCaption ? 'primary' : 'default'}
      onClick={() => setShowCaption(!isShowCaption)}
    >
      <Tooltip
        title={t('CONVERSATION.CAPTION')}
        triggerItem={<ScanText size={20}/> }
      />
    </Button.Icon>
 
}
