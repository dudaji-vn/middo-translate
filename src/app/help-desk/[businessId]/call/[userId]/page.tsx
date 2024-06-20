"use client";

import { PageLoading } from "@/components/feedback";
import { SOCKET_CONFIG } from "@/configs/socket";
import { CommonComponent } from "@/features/call/components/common/common";
import { VIDEO_CALL_LAYOUTS } from "@/features/call/constant/layout";
import { STATUS } from "@/features/call/constant/status";
import useSocketVideoCall from "@/features/call/hooks/socket/use-socket-video-call";
import { useVideoCallStore } from "@/features/call/store/video-call.store";
import VideoCall from "@/features/call/video-call";
import socket from "@/lib/socket-io";
import { getHelpDeskCallInformation } from "@/services/video-call.service";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";

interface HelpDeskCallProps {
  params: {
    userId: string;
    businessId: string;
  }
}

const HelpDeskCall = ({ params }: HelpDeskCallProps) => {
  const setRoom = useVideoCallStore(state => state.setRoom);
  const setFullScreen = useVideoCallStore(state => state.setFullScreen);
  const setLayout = useVideoCallStore(state => state.setLayout);
  const setData = useAuthStore(state => state.setData);
  const socketConnected = useAppStore((state) => state.socketConnected);
  useSocketVideoCall();
  const [status, setStatus] = useState<"WAITING" | "JOINED" | "BLOCK">("WAITING");
  useEffect(()=>{
    const { userId, businessId } = params;
    const fetchCall = async () => {
      try {
        let res = await getHelpDeskCallInformation(businessId, userId);
        const {call, status, user} = res.data;
        if(status === STATUS.MEETING_STARTED) {
          setRoom(call)
          setData({
            user: user
          });
          setFullScreen(true);
          setLayout(VIDEO_CALL_LAYOUTS.P2P_VIEW)
          setStatus("JOINED");
        }
      } catch (error) {
        window.close();
      }
    }
    fetchCall();
  },[params, setData, setFullScreen, setLayout, setRoom])

  useEffect(() => {
    const blockJoinMeeting = () => {
      setStatus("BLOCK");
    }
    socket.on(SOCKET_CONFIG.EVENTS.MEETING.BLOCK, blockJoinMeeting);
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MEETING.BLOCK, blockJoinMeeting);
    }
  }, []);
  if(!socketConnected || status == 'WAITING') return <PageLoading />
  if(status == 'BLOCK') return <div>
    <p> You can not join this meeting </p>
  </div>


  return (
   <>
    <VideoCall />
    <CommonComponent />
   </>
  );
};

export default HelpDeskCall;
