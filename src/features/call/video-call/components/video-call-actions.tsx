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
import processingStream from '../../utils/processing-stream';

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
  const { setLoadingVideo } = useMyVideoCallStore();

  const handleChangeCameraOrMic = ({
    video,
    audio,
  }: {
    video?: boolean;
    audio?: boolean;
  }) => {
    if (!socket.id) return;
    if (!myStream) return;
    // Check video or audio undefined
    if (video === undefined) {
      video = isTurnOnCamera;
    }
    if (audio === undefined) {
      audio = isTurnOnMic;
    }

    if (!audio) {
      SpeechRecognition.stopListening();
    }

    if (video && isTurnOnCamera && myStream.getAudioTracks().length > 0) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = audio || false;
      });
      return;
    }
    if (video != isTurnOnCamera) {
      setLoadingVideo(true);
    }

    myStream.getTracks().forEach((track) => track.stop());
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
      return;
    }
    const streamConfig = getStreamConfig(video, audio);
    navigator.mediaDevices
      .getUserMedia({ ...streamConfig })
      .then((stream: MediaStream) => {
        const myVideoStream = processingStream(stream);
        if (!audio && myVideoStream.getAudioTracks().length > 0) {
          myVideoStream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
        }
        setStreamForParticipant(myVideoStream, socket.id || '', false);
        setMyStream(myVideoStream);
        setLoadingVideo(false);
      })
      .catch(() => {
        toast.error('Can not access to your camera or mic');
        setTurnOnCamera(false);
        setTurnOnMic(false);
        setLoadingVideo(false);
      });
  };

  return (
    <section className="relative z-20 flex items-center justify-between bg-primary-100 p-2">
      <div className="flex w-full justify-center gap-6">
        <DropdownActions />
        <ActionChat />
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
