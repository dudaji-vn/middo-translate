'use client';

import {
  Brush,
  LayoutGrid,
  Lightbulb,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  MoreVertical,
  Phone,
  ScanText,
  Subtitles,
  TextSelect,
  UserPlus2,
  UserPlus2Icon,
  Users2,
  Users2Icon,
  Video,
  VideoOff,
  X,
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
import { CALL_TYPE } from '../constant/call-type';

export interface VideoCallBottomProps { }

export const VideoCallBottom = ({ }: VideoCallBottomProps) => {
  const { setConfirmLeave } = useVideoCallStore();
  const { isTurnOnMic, isTurnOnCamera, setTurnOnMic, setTurnOnCamera, myStream } = useMyVideoCallStore()
  const { participants } = useParticipantVideoCallStore()
  const { isDoodle, isMeDoole, isDrawing, setDrawing, isFullScreen, isPinShareScreen, setLayout, isShowChat, setShowChat, isShowCaption, setShowCaption, setModalAddUser, room } = useVideoCallStore();
  const { isShareScreen } = useMyVideoCallStore();
  const { handleShareScreen, handleStartDoodle } = useVideoCallContext();
  const [isShowInvite, setShowInvite] = useState(true);
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
    <section className={twMerge("relative flex items-center justify-between z-20 border-b border-t",
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
            {room.type === CALL_TYPE.GROUP && 
            <DropdownMenuItem onClick={() => setModalAddUser(true)}>
              <UserPlus2 />
              <span className='ml-2'>Add member</span>
            </DropdownMenuItem>
            }
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
          // disabled={haveShareScreen && !isShareScreen}
          className={`${(isFullScreen || room.type !== CALL_TYPE.GROUP) ? 'hidden' : ''}`}
          onClick={() => setModalAddUser(true)}
        >
          <UserPlus2 />
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
      {participants.length == 1 && room.type === CALL_TYPE.GROUP && isShowInvite && isFullScreen && 
      <div className='absolute md:hidden bottom-full left-0 right-0 px-3 py-5 bg-gradient-to-t from-black/20'>
        <div className='bg-neutral-50 rounded-xl p-2'>
          <div className='text-neutral-600 flex items-center'>
            <Lightbulb className='text-neutral-400 w-4 h-4' />
            <p className='ml-1 flex-1'>Notice</p>
            <X className='text-neutral-400 w-4 h-4 cursor-pointer' onClick={() => setShowInvite(false)} />
          </div>
          <p className='text-sm text-neutral-400 font-light mt-2'>Memeber in group will not receive any in coming call alert till you invite them to join</p>
        </div>
        <Button
          onClick={() => setModalAddUser(true)}
          size="sm"
          color="primary"
          variant="default"
          className='mx-auto mt-2 block'
          shape="square"
          startIcon={<UserPlus2Icon />}
        >
          Invite
        </Button>
      </div>}
    </section>
  );
};
