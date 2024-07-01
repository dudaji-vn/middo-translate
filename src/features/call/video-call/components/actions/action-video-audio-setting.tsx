import { DropdownMenuItem } from '@/components/data-display';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal } from 'lucide-react';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
interface ActionVideoAudioSettingProps {
  isInDropdown?: boolean;
}
const ActionVideoAudioSetting = ({isInDropdown}: ActionVideoAudioSettingProps) => {
  const { t } = useTranslation('common');

  const setModalAudioVideoSetting = useVideoCallStore((state) => state.setModalAudioVideoSetting);
  
  if (isInDropdown) {
    return (
      <>
        <DropdownMenuItem onClick={() => setModalAudioVideoSetting(true)} className="dark:hover:bg-neutral-800">
          <SlidersHorizontal />
          <span className="ml-2">{t('CONVERSATION.VIDEO_AUDIO_SETTINGS')}</span>
        </DropdownMenuItem>
      </>
    );
  }

  return <Button.Icon
      variant="default"
      size="xs"
      color={'default'}
      onClick={() => setModalAudioVideoSetting(true)}
    >
      <Tooltip
        title={t('CONVERSATION.VIDEO_AUDIO_SETTINGS')}
        triggerItem={<SlidersHorizontal size={20}/> }
      />
    </Button.Icon>
  
};

export default memo(ActionVideoAudioSetting);
