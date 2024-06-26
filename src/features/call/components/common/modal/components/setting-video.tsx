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
import { Camera, CameraOff, Video } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface SettingVideoProps {
  className?: string;
  onSettingChange: (setting: VideoSetting) => void;
}
const SettingVideo = ({ className, onSettingChange}: SettingVideoProps) => {
  const { t } = useTranslation('common');
  
  const video = useVideoSettingStore(state => state.video);
  const setVideo = useVideoSettingStore(state => state.setVideo);

  const { videoInputDevices } = useGetAudioVideoSource();
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Check is allow to access camera
  const [isAllowCamera, setIsAllowCamera] = useState<boolean>(true);
  
  useEffect(() => {
    const checkIsAllowCamera = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setIsAllowCamera(true);
      } catch (error) {
        setIsAllowCamera(false);
      }
    }
    checkIsAllowCamera();
  }, []);

  const onVideoInputChange = (val: string) => {
    const selected = videoInputDevices.find(
      (device) => device.deviceId === val,
    );
    if (selected) {
      setVideo(selected);
      onSettingChange({
        type: 'video',
        deviceId: selected.deviceId,
      })
    }
  };
  useEffect(() => {
    if (videoInputDevices.length == 0) return;
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          deviceId:
          video?.deviceId ||
            videoInputDevices[0]?.deviceId ||
            undefined,
        },
      })
      .then((stream) => {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
        setStream(stream);
      })
      .catch((err) => {});
  }, [videoInputDevices, video?.deviceId]);

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

  return (
    <div className={className}>
      <Typography variant="h5" className="mb-2 text-sm">
        <Video className="mr-1 inline-block" size={16} />
        {t('MODAL.AUDIO_VIDEO_SETTING.VIDEO')}
      </Typography>
      {videoInputDevices.length > 0 ? <Select
        value={
          video?.deviceId || videoInputDevices[0]?.deviceId || ''
        }
        onValueChange={onVideoInputChange}
      >
        <SelectTrigger className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-900 dark:dark:bg-neutral-800 dark:active:text-neutral-50 !py-2 shadow-none">
          <SelectValue>
            {video
              ? video.label
              : videoInputDevices.length > 0
                ? videoInputDevices[0].label
                : ''}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className='dark:bg-neutral-900 dark:border-neutral-800'>
          {videoInputDevices.map((device) => (
            <SelectItem key={device.deviceId} value={device.deviceId} className="dark:hover:bg-neutral-800">
              <span>{device.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select> : <Typography variant="h6" className="text-sm font-normal">{t('MESSAGE.ERROR.NOT_ALLOW_CAMERA')}</Typography>}
      <div className="mt-2 h-40 w-full overflow-hidden first-letter:rounded-lg">
        {isAllowCamera ? <video
          className="m-auto h-full w-fit rounded-lg object-contain"
          autoPlay
          playsInline
          ref={(video) => {
            if (video && stream) {
              video.srcObject = stream;
            }
          }}
        /> : <div className="m-auto h-full w-[80%] rounded-lg bg-neutral-50">
          <CameraOff className="m-auto h-full w-fit text-red-400" size={40} />
        </div> }
      </div>
    </div>
  );
};

export default memo(SettingVideo);
