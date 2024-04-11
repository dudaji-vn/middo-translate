import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useTranslation } from 'react-i18next';
import SettingVideo from './components/setting-video';
import SettingMicrophone from './components/setting-microphone';
import SettingSpeaker from './components/setting-speaker';
import VideoSetting from '@/features/call/interfaces/video-setting.interface';
import { useCallback } from 'react';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import getUserStream from '@/features/call/utils/get-user-stream';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import toast from 'react-hot-toast';
import socket from '@/lib/socket-io';

export const ModalAudioVideoSetting = () => {
  const { isShowModalAudioVideoSetting, setModalAudioVideoSetting } =
    useVideoCallStore();
  const { t } = useTranslation('common');
  const {isTurnOnMic, isTurnOnCamera, myStream, setLoadingVideo, setMyStream, setTurnOnCamera, setTurnOnMic, setLoadingStream} = useMyVideoCallStore();
    const {setStreamForParticipant} = useParticipantVideoCallStore();
  const onSettingChange = useCallback(({ type, deviceId }: VideoSetting) => {
    if((type === 'video' && !isTurnOnCamera) || (type === 'audio' && !isTurnOnMic)) return;
    if(myStream) {
        myStream.getTracks().forEach((track) => {
          track.stop();
        });
    }
    setLoadingVideo(true);
    getUserStream({isTurnOnCamera: isTurnOnCamera, isTurnOnMic: true, cameraDeviceId: type === 'video' ? deviceId : undefined, micDeviceId: type === 'audio' ? deviceId : undefined})
      .then((stream: MediaStream) => {
        const myVideoStream = stream;
        if (!isTurnOnMic && myVideoStream.getAudioTracks().length > 0) {
          myVideoStream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
        }
        setStreamForParticipant(myVideoStream, socket.id || '', false);
        setMyStream(myVideoStream);
        setLoadingVideo(false);
        setTurnOnCamera(isTurnOnCamera);
        setTurnOnMic(isTurnOnMic);
      })
      .catch(() => {
        toast.error(t('MESSAGE.ERROR.NO_ACCESS_MEDIA'));
        setTurnOnCamera(false);
        setTurnOnMic(false);
        setLoadingVideo(false);
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingStream(false);
        }, 1000);
      });
  }, [isTurnOnCamera, isTurnOnMic, myStream, setLoadingStream, setLoadingVideo, setMyStream, setStreamForParticipant, setTurnOnCamera, setTurnOnMic, t])
  return (
    <div>
      <AlertDialog
        open={isShowModalAudioVideoSetting}
        onOpenChange={() => setModalAudioVideoSetting(false)}
      >
        <AlertDialogContent className="md:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('MODAL.AUDIO_VIDEO_SETTING.TITLE')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="-mx-5 overflow-y-auto p-5 pt-2">
            <SettingVideo className="mb-5" onSettingChange={onSettingChange}/>
            <SettingMicrophone className="mb-5" onSettingChange={onSettingChange}/>
            <SettingSpeaker />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="mr-4">
              {t('COMMON.CLOSE')}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
