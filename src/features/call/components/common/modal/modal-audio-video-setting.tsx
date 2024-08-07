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
import getUserStream, { ResponseUserMedia } from '@/features/call/utils/get-user-stream';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import toast from 'react-hot-toast';
import socket from '@/lib/socket-io';
import { useVideoSettingStore } from '@/features/call/store/video-setting.store';
import customToast from '@/utils/custom-toast';

export const ModalAudioVideoSetting = () => {
  const { t } = useTranslation('common');

  const setModal = useVideoCallStore(state => state.setModal);
  const modal = useVideoCallStore(state => state.modal);
  const isTurnOnMic = useMyVideoCallStore(state => state.isTurnOnMic);
  const isTurnOnCamera = useMyVideoCallStore(state => state.isTurnOnCamera);
  const myStream = useMyVideoCallStore(state => state.myStream);
  const setLoadingVideo = useMyVideoCallStore(state => state.setLoadingVideo);
  const setMyStream = useMyVideoCallStore(state => state.setMyStream);
  const setTurnOnCamera = useMyVideoCallStore(state => state.setTurnOnCamera);
  const setTurnOnMic = useMyVideoCallStore(state => state.setTurnOnMic);
  const setLoadingStream = useMyVideoCallStore(state => state.setLoadingStream);
  const setStreamForParticipant = useParticipantVideoCallStore(state => state.setStreamForParticipant);
  const audio = useVideoSettingStore(state => state.audio);
  const video = useVideoSettingStore(state => state.video);

  const onSettingChange = useCallback(({ type, deviceId }: VideoSetting) => {
    if((type === 'video' && !isTurnOnCamera) || (type === 'audio' && !isTurnOnMic)) return;
    if(myStream) {
        myStream.getTracks().forEach((track) => {
          track.stop();
        });
    }
    setLoadingVideo(true);
    let myVideoStream: MediaStream = new MediaStream();
    getUserStream({
      isTurnOnCamera: isTurnOnCamera, 
      isTurnOnMic: true, 
      cameraDeviceId: type === 'video' ? deviceId : video?.deviceId, 
      micDeviceId: type === 'audio' ? deviceId : audio?.deviceId
    })
      .then(({stream, isTurnOnMic, isTurnOnCamera}: ResponseUserMedia) => {
        myVideoStream = stream ? stream : myVideoStream;
        setTurnOnCamera(isTurnOnCamera);
        setTurnOnMic(isTurnOnMic);
        if (!isTurnOnMic && myVideoStream?.getAudioTracks() && myVideoStream?.getAudioTracks()?.length > 0) {
          myVideoStream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
        }
        setStreamForParticipant(myVideoStream, socket.id || '', false);
        setMyStream(myVideoStream);
        setLoadingVideo(false);
        setTimeout(() => {
          setLoadingStream(false);
        }, 1000);
      })
      .catch(() => {
        customToast.error(t('MESSAGE.ERROR.NO_ACCESS_MEDIA'));
      })
      .finally(() => {});
  }, [audio?.deviceId, isTurnOnCamera, isTurnOnMic, myStream, setLoadingStream, setLoadingVideo, setMyStream, setStreamForParticipant, setTurnOnCamera, setTurnOnMic, t, video?.deviceId])
  
  return (
    <div>
      <AlertDialog
        open={modal == 'video-setting'}
        onOpenChange={() => setModal()}
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
            <AlertDialogCancel>
              {t('COMMON.CLOSE')}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
