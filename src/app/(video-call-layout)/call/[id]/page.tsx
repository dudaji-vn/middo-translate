// @ts-nocheck
'use client';

import { VideoCallBottom } from "@/features/call/components/call-bottom";
import VideoCallContent from "@/features/call/components/call-content";
import { VideoCallHeader } from "@/features/call/components/call-header";
import { Fragment, useEffect, useRef, useState } from "react";
import peerInstance from "@/features/call/context/peerInstance";
import { useVideoCallStore } from "@/features/call/store";
import ReactPlayer from "react-player";
import socket from "@/lib/socket-io";
import { useAuthStore } from "@/stores/auth";

interface VideoCallPageProps {
  params: { id: string };
}
const VideoCallPage = ({ params }: VideoCallPageProps) => {
  const { id: roomId } = params;
  const { user } = useAuthStore();
  const { participants, myPeerId, setMyPeerId, addParticipant, removeParticipant } = useVideoCallStore();
  const myVideoStreamRef = useRef(null);

  console.log({participants})
  useEffect(() => {
    peerInstance.on('open', (peerId) => {
      setMyPeerId(peerId);
      socket.emit('call.join', { peerId, roomId, user });
    })
    
    peerInstance.on('error', (err) => console.log(err))
    
    socket.on('call.join', (data) => {
      if(!myVideoStreamRef.current) return;
      const call = peerInstance.call(data.peerId, myVideoStreamRef.current);
      call.on('stream', userStream => {
        addParticipant({ peerId: data.peerId, stream: userStream, user: data.user })
      })
    })
    socket.on('call.leave', (peerId) => {
      removeParticipant(peerId)
    })

    const navigator = window.navigator as any;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if(!myPeerId) return;
        myVideoStreamRef.current = stream;
        addParticipant({ peerId: myPeerId, stream, user })
        peerInstance.on('call', call => {
          call.answer(stream);
          call.on('stream', userStream => {
            // add par
            console.log("Add pa")
            console.log({userStream})
            addParticipant({ peerId: call.peer, stream: userStream, user })
          })
          call.on('error', (err) => console.log(err))
          call.on("close", () => console.log('Close'))
        })
      }).catch(err => console.log(err.message))
    
  }, [addParticipant, myPeerId, removeParticipant, roomId, setMyPeerId, user]);

  return <main className="h-dvh w-full flex flex-col">
    <VideoCallHeader />
    <section className="flex-1">
      <VideoCallContent participants={participants}></VideoCallContent>
    </section>
    <VideoCallBottom />
  </main>;
};

export default VideoCallPage;
