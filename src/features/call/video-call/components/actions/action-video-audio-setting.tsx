import { DropdownMenuItem } from '@/components/data-display';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal } from 'lucide-react';
import { useVideoCallStore } from '@/features/call/store/video-call.store';

const ActionVideoAudioSetting = () => {
  const { t } = useTranslation('common');

  const setModalAudioVideoSetting = useVideoCallStore((state) => state.setModalAudioVideoSetting);
  
  return (
    <>
      <DropdownMenuItem onClick={() => setModalAudioVideoSetting(true)} className="dark:hover:bg-neutral-800">
        <SlidersHorizontal />
        <span className="ml-2">{t('CONVERSATION.VIDEO_AUDIO_SETTINGS')}</span>
      </DropdownMenuItem>
    </>
  );
};

export default memo(ActionVideoAudioSetting);
