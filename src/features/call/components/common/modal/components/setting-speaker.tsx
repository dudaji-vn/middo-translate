import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/data-entry';
import useGetAudioVideoSource from '@/features/call/hooks/use-get-audio-video-source';
import { useVideoSettingStore } from '@/features/call/store/video-setting.store';
import { Mic, Volume1Icon, Volume2Icon } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface SettingSpeakerProps {
  className?: string;
}
const SettingSpeaker = ({ className }: SettingSpeakerProps) => {
  const { t } = useTranslation('common');

  const speaker = useVideoSettingStore((state) => state.speaker);
  const setSpeaker = useVideoSettingStore((state) => state.setSpeaker);

  const { audioOutputDevices } = useGetAudioVideoSource();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const testSpeaker = () => {
    if (isPlaying) return;
    const audio = new Audio('/mp3/test.mp3');
    // @ts-ignore
    audio.setSinkId(speaker?.deviceId || audioOutputDevices[0]?.deviceId || '');
    audio.play();
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    setIsPlaying(true);
  };
  const onAudioOutputChange = (val: string) => {
    const selected = audioOutputDevices.find(
      (device) => device.deviceId === val,
    );
    if (selected) {
      setSpeaker(selected);
      const videos = document.querySelectorAll('video.video-participant');
      videos.forEach(async (video) => {
        // console.log('🟡video', video);
        // @ts-ignore
        // video.setSinkId(selected.deviceId);
        // await video.setSinkId(selected.deviceId);
      });
    }
  };

  return (
    <div className={className}>
      <Typography variant="h5" className="mb-2 text-sm">
        <Volume1Icon className="mr-1 inline-block" size={16} />
        {t('MODAL.AUDIO_VIDEO_SETTING.SPEAKER')}
      </Typography>
      <div className="flex gap-2">
        <Select
          value={speaker?.deviceId || audioOutputDevices[0]?.deviceId || ''}
          onValueChange={onAudioOutputChange}
        >
          <SelectTrigger className="w-full flex-1 rounded-xl bg-neutral-50 !py-2 shadow-none">
            <SelectValue>
              {speaker
                ? speaker.label
                : audioOutputDevices.length > 0
                  ? audioOutputDevices[0].label
                  : ''}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {audioOutputDevices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                <span>{device.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button.Icon
          size="sm"
          variant={'ghost'}
          shape={'square'}
          onClick={testSpeaker}
        >
          <Volume2Icon
            size={16}
            className={isPlaying ? 'text-primary' : 'text-neutral-800'}
          />
        </Button.Icon>
      </div>
    </div>
  );
};

export default memo(SettingSpeaker);
