import { Typography } from '@/components/data-display';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/data-entry';
import useGetAudioVideoSource from '@/features/call/hooks/use-get-audio-video-source';
import VideoSetting from '@/features/call/interfaces/video-setting.interface';
import { useVideoSettingStore } from '@/features/call/store/video-setting.store';
import useAudioLevel from '@/hooks/use-audio-level';
import { Mic } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface SettingMicrophoneProps {
  className?: string;
  onSettingChange: (setting: VideoSetting) => void;
}
const SettingMicrophone = ({ className, onSettingChange }: SettingMicrophoneProps) => {
  const { t } = useTranslation('common');

  const audio = useVideoSettingStore(state => state.audio);
  const setAudio = useVideoSettingStore(state => state.setAudio);

  const { audioInputDevices } = useGetAudioVideoSource();
  const [stream, setStream] = useState<MediaStream | undefined>();
  const { level } = useAudioLevel(stream);
  
  useEffect(() => {
    if (audioInputDevices.length == 0) return;
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId:
            audio?.deviceId ||
            audioInputDevices[0]?.deviceId ||
            undefined,
        },
        video: false,
      })
      .then((stream) => {
        stream.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });
        setStream(stream);
      })
      .catch((err) => {});
  }, [audio?.deviceId, audioInputDevices]);
  
  // cleanup stream
  useEffect(() => {
      return () => {
      if (stream) {
          stream.getTracks().forEach((track) => {
          track.stop();
          });
      }
      };
  }, [stream]);

  const onVideoInputChange = (val: string) => {
    const selected = audioInputDevices.find(
      (device) => device.deviceId === val,
    );
    if (selected) {
      setAudio(selected);
      onSettingChange({
        type: 'audio',
        deviceId: selected.deviceId,
      })
    }
  }

  return (
    <div className={className}>
      <Typography variant="h5" className="text-sm mb-2">
        <Mic className="mr-1 inline-block" size={16} />
        {t('MODAL.AUDIO_VIDEO_SETTING.AUDIO')}
      </Typography>
      <Select value={audio?.deviceId || audioInputDevices[0]?.deviceId || ""} onValueChange={onVideoInputChange}>
        <SelectTrigger className="w-full rounded-xl bg-neutral-50 !py-2 shadow-none">
          <SelectValue>
            {audio
              ? audio.label
              : audioInputDevices.length > 0
                ? audioInputDevices[0].label
                : ''}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {audioInputDevices.map((device) => (
            <SelectItem key={device.deviceId} value={device.deviceId}>
              <span>{device.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-2  w-full overflow-hidden first-letter:rounded-lg">
        <div className='h-3 w-full bg-neutral-100 rounded-xl overflow-hidden relative'>
          <div className='absolute bg-primary left-0 top-0 bottom-0 transition-all' style={{width: level + '%'}}></div>
        </div>
      </div>
    </div>
  );
};

export default memo(SettingMicrophone);
