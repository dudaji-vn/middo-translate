'use client';

import socket from '@/lib/socket-io';
import toast from 'react-hot-toast';
import SpeechRecognition from 'react-speech-recognition';
import { useMyVideoCallStore } from '../../store/me.store';
import { useParticipantVideoCallStore } from '../../store/participant.store';
import { encoderData } from '../../utils/text-decoder-encoder';
import getStreamConfig from '../../utils/get-stream-config';
import ActionToggleCamera from './actions/action-toggle-camera';
import ActionToggleMic from './actions/action-toggle-mic';
import ActionLeaveCall from './actions/leave-call';
import ActionShareScreen from './actions/action-share-screen';
import ActionAddMembers from './actions/action-add-members';
import ActionChat from './actions/action-chat';
import InviteTooltip from './invite-tooltip';
import DropdownActions from './actions/dropdown-actions';
import getUserStream from '../../utils/get-user-stream';
import ActionDraw from './actions/action-draw';
import { useTranslation } from 'react-i18next';
import useSpeechRecognizer from '@/hooks/use-speech-recognizer';
interface MediaStreamInterface {
  video?: boolean;
  audio?: boolean;
}
export default function VideoCallActions() {
  const {
    isTurnOnMic,
    isTurnOnCamera,
    setTurnOnMic,
    setTurnOnCamera,
    myStream,
    setMyStream,
  } = useMyVideoCallStore();
  const { participants, setStreamForParticipant } =
    useParticipantVideoCallStore();
  const { setLoadingVideo, isLoadingStream, setLoadingStream } = useMyVideoCallStore();
  const {t} = useTranslation('common')
  const handleChangeCameraOrMic = (settings: MediaStreamInterface) => {
    if (!socket.id || !myStream) return;
    const video = settings?.video == undefined ? isTurnOnCamera : settings?.video;
    const audio = settings?.audio == undefined ? isTurnOnMic : settings?.audio;
    console.log('handleChangeCameraOrMic', video, audio);
    if(isLoadingStream) return;

    // CASE: No change in camera
    if (video && isTurnOnCamera && myStream.getVideoTracks().length > 0) {
      console.log('video-call-actions.tsx - Line 48 :: No change in camera');
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = audio || false;
      });
      setTurnOnMic(audio);
      return;
    }
    if (video != isTurnOnCamera) {
      setLoadingVideo(true);
    }

    myStream.getTracks().forEach((track) => track.stop());
    setLoadingStream(true)
    if (!video && !audio) {
      let newUserMedia = new MediaStream();
      setStreamForParticipant(newUserMedia, socket.id || '', false);
      participants.forEach((participant) => {
        if (participant.peer) {
          let data = {
            type: 'STOP_STREAM',
            payload: null,
          };
          participant.peer.send(encoderData(data));
        }
      });
      setLoadingVideo(false);
      setLoadingStream(false);
      setTurnOnCamera(false);
      setTurnOnMic(false);
      return;
    }
    
    getUserStream({isTurnOnCamera: video, isTurnOnMic: true})
      .then((stream: MediaStream) => {
        const myVideoStream = stream;
        if (!audio && myVideoStream.getAudioTracks().length > 0) {
          myVideoStream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
        }
        setStreamForParticipant(myVideoStream, socket.id || '', false);
        setMyStream(myVideoStream);
        setLoadingVideo(false);
        setTurnOnCamera(video);
        setTurnOnMic(audio);
      })
      .catch(() => {
        toast.error(t('MESSAGE.ERROR.NO_ACCESS_MEDIA'));
        setTurnOnCamera(false);
        setTurnOnMic(false);
        setLoadingVideo(false);
      })
      .finally(() => {
        setLoadingStream(false);
      });
  };

  return (
    <section className="relative z-20 flex items-center justify-between bg-primary-100 p-2">
      <div className="flex w-full md:justify-center justify-around md:gap-6">
        <DropdownActions />
        <ActionChat />
        <ActionDraw />
        <ActionAddMembers />
        <ActionShareScreen />
        <ActionToggleCamera handleChangeCameraOrMic={handleChangeCameraOrMic} />
        <ActionToggleMic handleChangeCameraOrMic={handleChangeCameraOrMic} />
        <ActionLeaveCall />
      </div>
      <InviteTooltip />
    </section>
  );
}
