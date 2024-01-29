'use client';

import {
  Brush,
  LayoutGrid,
  Lightbulb,
  Mic,
  MicOff,
  MonitorUp,
  MoreVertical,
  Phone,
  ScanText,
  Subtitles,
  UserPlus2,
  UserPlus2Icon,
  Video,
  VideoOff,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useVideoCallContext } from '../context/video-call-context';
import { useVideoCallStore } from '../store/video-call.store';
import { useParticipantVideoCallStore } from '../store/participant.store';
import { useMyVideoCallStore } from '../store/me.store';
import ParticipantInVideoCall from '../interfaces/participant';
import socket from '@/lib/socket-io';
import { Button } from '@/components/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
import { CALL_TYPE } from '../constant/call-type';
import getStreamConfig from '../utils/get-stream-config';
import toast from 'react-hot-toast';
import SpeechRecognition from 'react-speech-recognition';
import { useAppStore } from '@/stores/app.store';

export interface VideoCallBottomProps {}

export const VideoCallBottom = ({}: VideoCallBottomProps) => {
  const {
    isTurnOnMic,
    isTurnOnCamera,
    setTurnOnMic,
    setTurnOnCamera,
    myStream,
    setMyStream,
    isShareScreen,
  } = useMyVideoCallStore();
  const { participants, setStreamForParticipant } =
    useParticipantVideoCallStore();
  const {
    isDoodle,
    isMeDoole,
    isDrawing,
    setDrawing,
    isFullScreen,
    isPinShareScreen,
    setLayout,
    isShowChat,
    setShowChat,
    isShowCaption,
    setShowCaption,
    setModalAddUser,
    room,
    setConfirmLeave,
    layout,
  } = useVideoCallStore();
  const { handleShareScreen, handleStartDoodle } = useVideoCallContext();
  const [isShowInvite, setShowInvite] = useState(true);
  const isMobile = useAppStore((state) => state.isMobile);
  const haveShareScreen = participants.some(
    (participant) => participant.isShareScreen,
  );
  const onDoodle = () => {
    if (!isDoodle && isMeDoole) return;
    // Start doodle
    if (haveShareScreen && !isDoodle) {
      setDrawing(true);
      handleStartDoodle();
    }
    // Toggle drawing
    if (isDoodle) {
      setDrawing(!isDrawing);
    }
  };
  const handleLeave = () => {
    setConfirmLeave(true);
  };
  const changeLayout = () => {
    setLayout(VIDEOCALL_LAYOUTS.GALLERY_VIEW);
  };

  const handleChangeCameraOrMic = ({
    video,
    audio,
  }: {
    video: boolean;
    audio: boolean;
  }) => {
    if (!socket.id) return;
    if (!myStream) return;
    if (!audio) {
      SpeechRecognition.stopListening();
    }
    if (video && isTurnOnCamera && myStream.getAudioTracks().length > 0) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = audio;
      });
      return;
    }
    myStream.getTracks().forEach((track) => track.stop());
    if (!video && !audio) return;
    const streamConfig = getStreamConfig(video, audio);
    navigator.mediaDevices
      .getUserMedia({ ...streamConfig })
      .then((stream: MediaStream) => {
        if (!audio && stream.getAudioTracks().length > 0) {
          stream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
        }
        setStreamForParticipant(stream, socket.id || '', false);
        setMyStream(stream);
      })
      .catch(() => {
        toast.error('Can not access to your camera or mic');
        setTurnOnCamera(isTurnOnCamera);
        setTurnOnMic(isTurnOnMic);
      });
  };
  const onToggleCamera = () => {
    setTurnOnCamera(!isTurnOnCamera);
    handleChangeCameraOrMic({
      video: !isTurnOnCamera,
      audio: isTurnOnMic,
    });
  };
  const onToggleMute = () => {
    setTurnOnMic(!isTurnOnMic);
    handleChangeCameraOrMic({
      video: isTurnOnCamera,
      audio: !isTurnOnMic,
    });
  };
  useEffect(() => {
    if (isMobile) setShowChat(false);
  }, []);
  return (
    <section
      className={twMerge(
        'relative z-20 flex items-center justify-between bg-primary-100 p-2',
      )}
    >
      <div className="flex w-full justify-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button.Icon
              variant="default"
              size="xs"
              color="default"
              className={`${!isFullScreen ? 'hidden' : ''}`}
            >
              <MoreVertical />
            </Button.Icon>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              disabled={layout == VIDEOCALL_LAYOUTS.GALLERY_VIEW}
              onClick={changeLayout}
            >
              <LayoutGrid />
              <span className="ml-2">Galery View</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                !haveShareScreen ||
                !isFullScreen ||
                !isPinShareScreen ||
                layout != VIDEOCALL_LAYOUTS.FOCUS_VIEW
              }
              onClick={onDoodle}
            >
              <Brush />
              <span className="ml-2">Screen Doodle</span>
            </DropdownMenuItem>
            {room.type === CALL_TYPE.GROUP && (
              <DropdownMenuItem onClick={() => setModalAddUser(true)}>
                <UserPlus2 />
                <span className="ml-2">Add member</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setShowCaption(!isShowCaption)}
              className={isShowCaption ? 'bg-primary-200' : ''}
            >
              <ScanText />
              <span className="ml-2">Caption</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button.Icon
          variant="default"
          size="xs"
          color={isShowChat ? 'primary' : 'default'}
          className={`${!isFullScreen ? 'hidden' : ''}`}
          onClick={() => setShowChat(!isShowChat)}
        >
          <Subtitles />
        </Button.Icon>
        <Button.Icon
          variant="default"
          size="xs"
          color={'default'}
          // disabled={haveShareScreen && !isShareScreen}
          className={`${
            isFullScreen || room.type !== CALL_TYPE.GROUP ? 'hidden' : ''
          }`}
          onClick={() => setModalAddUser(true)}
        >
          <UserPlus2 />
        </Button.Icon>
        <Button.Icon
          variant="default"
          size="xs"
          color={isShareScreen ? 'primary' : 'default'}
          disabled={haveShareScreen && !isShareScreen}
          onClick={handleShareScreen}
        >
          <MonitorUp />
        </Button.Icon>

        <Button.Icon
          variant="default"
          size="xs"
          color={isTurnOnCamera ? 'primary' : 'default'}
          onClick={onToggleCamera}
        >
          {isTurnOnCamera ? <Video /> : <VideoOff />}
        </Button.Icon>
        <Button.Icon
          variant="default"
          size="xs"
          color={isTurnOnMic ? 'primary' : 'default'}
          onClick={onToggleMute}
        >
          {isTurnOnMic ? <Mic /> : <MicOff />}
        </Button.Icon>
        <Button.Icon
          variant="default"
          size="xs"
          color="error"
          title="Leave"
          onClick={handleLeave}
        >
          <Phone className="rotate-[135deg]" />
        </Button.Icon>
      </div>
      {participants.length == 1 &&
        room.type === CALL_TYPE.GROUP &&
        isShowInvite &&
        isFullScreen && (
          <div className="absolute bottom-full left-0 right-0 flex h-[300px] flex-col bg-gradient-to-t from-black/80 px-3 py-5  md:hidden">
            <div className="mt-auto rounded-xl bg-neutral-50 p-2">
              <div className="flex items-center text-neutral-600">
                <Lightbulb className="h-4 w-4 text-neutral-400" />
                <p className="ml-1 flex-1">Notice</p>
                <X
                  className="h-4 w-4 cursor-pointer text-neutral-400"
                  onClick={() => setShowInvite(false)}
                />
              </div>
              <p className="mt-2 text-sm font-light text-neutral-400">
                Memeber in group will not receive any in coming call alert till
                you invite them to join
              </p>
            </div>
            <Button
              onClick={() => setModalAddUser(true)}
              size="sm"
              color="primary"
              variant="default"
              className="mx-auto mt-2 block"
              shape="square"
              startIcon={<UserPlus2Icon />}
            >
              Invite
            </Button>
          </div>
        )}
    </section>
  );
};
