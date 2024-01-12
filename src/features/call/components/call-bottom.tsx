'use client';

import {
  Brush,
  LayoutGrid,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  MoreVertical,
  Phone,
  ScanText,
  Subtitles,
  TextSelect,
  Users2Icon,
  Video,
  VideoOff,
} from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

import ButtonDataAction from '@/components/actions/button/button-data-action';
import formatTime from '../utils/format-time.util';
import { twMerge } from 'tailwind-merge';
import { useVideoCallContext } from '../context/video-call-context';
import { useVideoCallStore } from '../store/video-call.store';
import { useParticipantVideoCallStore } from '../store/participant.store';
import { useMyVideoCallStore } from '../store/me.store';
import ParicipantInVideoCall from '../interfaces/participant';
import socket from '@/lib/socket-io';
import { Button } from '@/components/actions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/data-display';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';

export interface VideoCallBottomProps { }

export const VideoCallBottom = ({ }: VideoCallBottomProps) => {
  const { setConfirmLeave } = useVideoCallStore();
  const { isTurnOnMic, isTurnOnCamera, setTurnOnMic, setTurnOnCamera, myStream } = useMyVideoCallStore()
  const { participants, clearPinParticipant } = useParticipantVideoCallStore()
  const { isDoodle, isMeDoole, isDrawing, setDrawing, isFullScreen, isPinShareScreen, setPinDoodle, setPinShareScreen, setLayout, isShowChat, setShowChat, isShowCaption, setShowCaption } = useVideoCallStore();
  const { isShareScreen } = useMyVideoCallStore();
  const { handleShareScreen, handleStartDoodle } = useVideoCallContext();
  const [isOpenMenuSelectLayout, setMenuSelectLayout] = useState(false);
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
  }
  const handleLeave = () => {
    setConfirmLeave(true);
  };
  const changeLayout = () => {
    setLayout(VIDEOCALL_LAYOUTS.GALLERY_VIEW)
  }
  const handleUpdatePeerMedia = (newMediaStream: MediaStream) => {
    participants.forEach(async (p: ParicipantInVideoCall) => {
      if (p.isMe || !p.peer) return;
      const oldStream = p.peer.streams[0];
      if (oldStream) {
        oldStream.getTracks().forEach((track: any) => {
          p.peer.removeTrack(track, oldStream)
        });
      }
      newMediaStream.getTracks().forEach((track: any) => {
        p.peer.addTrack(track, newMediaStream)
      });
    })
  }
  const handleChangeCameraOrMic = ({ video, audio }: { video: boolean; audio: boolean }) => {
    if (!myStream) return;
    if (!socket.id) return;
    // Disable both audio and video
    // if (!video && !audio) {
    //   let newMyStream = new MediaStream();
    //   myStream.getTracks().forEach((track) => {
    //     track.stop();
    //   });
    //   setMyStream(newMyStream);
    //   setStreamForParticipant(newMyStream, socket.id, false)
    //   handleUpdatePeerMedia(newMyStream)
    //   return;
    // }
    // // If video on and current video on and audio off => just disable track audio
    // if (video && isTurnOnCamera && myStream.getAudioTracks()[0]) {
    //   myStream.getAudioTracks()[0].enabled = audio;
    //   return;
    // }
    // // Create new stream
    // myStream.getTracks().forEach((track) => {
    //   track.stop();
    // });
    // const navigator = window.navigator as any;
    // navigator.mediaDevices
    //   .getUserMedia({ video: video, audio: true })
    //   .then((stream: MediaStream) => {
    //     if (!socket.id) return;
    //     stream.getAudioTracks()[0].enabled = audio
    //     setMyStream(stream)
    //     setStreamForParticipant(stream, socket.id, false)
    //     handleUpdatePeerMedia(stream)
    //   });

    myStream.getTracks().forEach((track) => {
      if (track.kind === 'audio') track.enabled = audio;
      if (track.kind === 'video') track.enabled = video;
    });
  }
  const onToggleCamera = () => {
    setTurnOnCamera(!isTurnOnCamera);
    handleChangeCameraOrMic({
      video: !isTurnOnCamera,
      audio: isTurnOnMic
    })
  }
  const onToggleMute = () => {
    setTurnOnMic(!isTurnOnMic)
    handleChangeCameraOrMic({
      video: isTurnOnCamera,
      audio: !isTurnOnMic
    })
  }
  return (
    <section className={twMerge("flex items-center justify-between z-20 border-b border-t",
      isFullScreen ? " p-3" : "border-b border-t border-neutral-50 p-1")}>
      <div className="flex md:gap-6 gap-2 justify-center w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button.Icon
              variant='default'
              color='default'
              className={`${!isFullScreen ? 'hidden' : ''}`}
            >
              <MoreVertical />
            </Button.Icon>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={changeLayout}>
              <LayoutGrid />
              <span className='ml-2'>Galery View</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!haveShareScreen || !isFullScreen || !isPinShareScreen} onClick={onDoodle}>
              <Brush />
              <span className='ml-2'>Screen Doodle</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowCaption(!isShowCaption)}
              className={isShowCaption ? 'bg-primary-200' : ''}
            >
              <ScanText />
              <span className='ml-2'>Caption</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button.Icon
          variant='default'
          color={isShowChat ? 'primary' : 'default'}
          className={`${!isFullScreen ? 'hidden' : ''}`}
          onClick={() => setShowChat(!isShowChat)}
        >
          <Subtitles />
        </Button.Icon>
        <Button.Icon
          variant='default'
          color={isShareScreen ? 'primary' : 'default'}
          disabled={haveShareScreen && !isShareScreen}
          onClick={handleShareScreen}
        >
          <MonitorUp />
        </Button.Icon>

        <Button.Icon
          variant='default'
          color={isTurnOnCamera ? 'primary' : 'default'}
          onClick={onToggleCamera}
        >
          {isTurnOnCamera ? <Video /> : <VideoOff />}
        </Button.Icon>
        <Button.Icon
          variant='default'
          color={isTurnOnMic ? 'primary' : 'default'}
          onClick={onToggleMute}
        >
          {isTurnOnMic ? <Mic /> : <MicOff />}
        </Button.Icon>
        <Button.Icon
          variant='default'
          color='error'
          title="Leave"
          onClick={handleLeave}
        >
          <Phone className="h-6 w-6 rotate-[135deg]" />
        </Button.Icon>
      </div>
    </section>
  );
};
