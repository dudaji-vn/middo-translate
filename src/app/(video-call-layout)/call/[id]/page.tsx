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

interface VideoCallPageProps {
  params: { id: string };
}
const VideoCallPage = ({ params }: VideoCallPageProps) => {
  const { id: roomId } = params;
  const { participants, myPeerId, setMyPeerId, myVideoStream, setMyVideoStream, addPaticipant } = useVideoCallStore();
  const myVideoStreamRef = useRef(null);
  const [peers, setPeers] = useState({});
  console.log("participants:", participants)
  useEffect(() => {
    peerInstance.on('open', (peerId) => {
      setMyPeerId(peerId);
      console.log("My peer Id: ", peerId)
      socket.emit('call.join', { peerId, roomId });
    })
    
    peerInstance.on('error', (err) => console.log(err))
    
    socket.on('call.join', (data) => {
      if(!myVideoStreamRef.current) return;
      const call = peerInstance.call(data.peerId, myVideoStreamRef.current);
      call.on('stream', userStream => {
        console.log('Receive stream from::', data.peerId)
        console.log(userStream)
        // let tmpStream = {...userStream}
        // tmpStream.id = tmpStream.replace("{", "").replace("}", "")
        // console.log(tmpStream)
        addPaticipant({ peerId: data.peerId, stream: userStream })
      })
    })
    const navigator = window.navigator as any;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if(!myPeerId) return;
        setMyVideoStream(stream);
        myVideoStreamRef.current = stream;
        addPaticipant({ peerId: myPeerId, stream })
        peerInstance.on('call', call => {
          call.answer(stream);
          call.on('stream', userStream => {
            console.log('Start Stream of another user::', userStream)
            addPaticipant({ peerId: call.peer, stream: userStream })
          })
          call.on('error', (err) => console.log(err))
          call.on("close", () => console.log('Close'))
        })
      }).catch(err => console.log(err.message))
  }, [addPaticipant, myPeerId, roomId, setMyPeerId, setMyVideoStream]);

  return <main className="h-dvh w-full flex flex-col">
    <VideoCallHeader />
    <section className="flex-1">
      <VideoCallContent participants={participants}></VideoCallContent>
    </section>
    <VideoCallBottom />
  </main>;
};

export default VideoCallPage;
