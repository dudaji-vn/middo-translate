'use client';

import { Brush, LayoutGrid, Lightbulb, Mic, MicOff, MonitorUp, MoreVertical, Phone, ScanText, Subtitles, UserPlus2, UserPlus2Icon, Video, VideoOff, X } from 'lucide-react';
import { useState } from 'react';
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
  const { isTurnOnMic, isTurnOnCamera, setTurnOnMic, setTurnOnCamera, myStream, setMyStream, isShareScreen } = useMyVideoCallStore()
  const { participants, setStreamForParticipant } = useParticipantVideoCallStore()
  const { isDoodle, isMeDoole, isDrawing, setDrawing, isFullScreen, isPinShareScreen, setLayout, isShowChat, setShowChat, isShowCaption, setShowCaption, setModalAddUser, room, setConfirmLeave, layout } = useVideoCallStore();
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
  
  const handleChangeCameraOrMic = ({ video, audio }: { video: boolean; audio: boolean }) => {
    if (!socket.id) return;
    if(!myStream) return;
    // myStream.getTracks().forEach((track) => {
    //   track.enabled = false
    // })
    // myStream.getTracks().forEach((track) => {
    //   track.stop()
    // });
    // if(!video && !audio) {
    //   return;
    // };
    // navigator.mediaDevices.getUserMedia({ video: video, audio: audio }).then((newStream: MediaStream) => {
    //   console.log('Start new stream')
    //   setStreamForParticipant(newStream, socket.id || '', false)
    //   participants.forEach((p: ParicipantInVideoCall) => {
    //     if (!p.isMe && p.peer.destroyed === false) {
    //       // p.peer.addStream(newStream)
    //       // REPLACE TRACK
    //       // Check have old video track
    //       if(myStream.getVideoTracks().length > 0) {
    //         p.peer.replaceTrack(myStream.getVideoTracks()[0], newStream.getVideoTracks()[0], myStream)
    //       } else {
    //         p.peer.addTrack(newStream.getVideoTracks()[0], newStream)
    //       }

    //       // Check audio track
    //       if(myStream.getAudioTracks().length > 0) {
    //         p.peer.replaceTrack(myStream.getAudioTracks()[0], newStream.getAudioTracks()[0], myStream)
    //       } else {
    //         p.peer.addTrack(newStream.getAudioTracks()[0], newStream)
    //       }
    //     }
    //   })
    //   setMyStream(newStream)
    // })
    
    
    
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
    <section className={twMerge("relative flex items-center justify-between z-20 border-b border-t p-2",
      isFullScreen ? "" : "border-b border-t border-neutral-50")}>
      <div className="flex gap-6 justify-center w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button.Icon
              variant='default'
              size='xs'
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
            <DropdownMenuItem disabled={!haveShareScreen || !isFullScreen || !isPinShareScreen || layout != VIDEOCALL_LAYOUTS.FOCUS_VIEW} onClick={onDoodle}>
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
          size='xs'
          color={isShowChat ? 'primary' : 'default'}
          className={`${!isFullScreen ? 'hidden' : ''}`}
          onClick={() => setShowChat(!isShowChat)}
        >
          <Subtitles />
        </Button.Icon>
        <Button.Icon
          variant='default'
          size='xs'
          color={isShareScreen ? 'primary' : 'default'}
          // disabled={haveShareScreen && !isShareScreen}
          className={`${(isFullScreen || room.type !== CALL_TYPE.GROUP) ? 'hidden' : ''}`}
          onClick={() => setModalAddUser(true)}
        >
          <UserPlus2 />
        </Button.Icon>
        <Button.Icon
          variant='default'
          size='xs'
          color={isShareScreen ? 'primary' : 'default'}
          disabled={haveShareScreen && !isShareScreen}
          onClick={handleShareScreen}
        >
          <MonitorUp />
        </Button.Icon>

        <Button.Icon
          variant='default'
          size='xs'
          color={isTurnOnCamera ? 'primary' : 'default'}
          onClick={onToggleCamera}
        >
          {isTurnOnCamera ? <Video /> : <VideoOff />}
        </Button.Icon>
        <Button.Icon
          variant='default'
          size='xs'
          color={isTurnOnMic ? 'primary' : 'default'}
          onClick={onToggleMute}
        >
          {isTurnOnMic ? <Mic /> : <MicOff />}
        </Button.Icon>
        <Button.Icon
          variant='default'
          size='xs'
          color='error'
          title="Leave"
          onClick={handleLeave}
        >
          <Phone className="rotate-[135deg]" />
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
