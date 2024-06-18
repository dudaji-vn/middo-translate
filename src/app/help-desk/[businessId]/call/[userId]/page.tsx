"use client";

import { PageLoading } from "@/components/feedback";
import { CommonComponent } from "@/features/call/components/common/common";
import { VIDEO_CALL_LAYOUTS } from "@/features/call/constant/layout";
import { STATUS } from "@/features/call/constant/status";
import { useVideoCallStore } from "@/features/call/store/video-call.store";
import VideoCall from "@/features/call/video-call";
import socket from "@/lib/socket-io";
import { getHelpDeskCallInformation } from "@/services/video-call.service";
import { useAppStore } from "@/stores/app.store";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

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
  
  useEffect(()=>{
    const { userId, businessId } = params;
    const fetchCall = async () => {
      let res = await getHelpDeskCallInformation(businessId, userId);
      const {call, status, user} = res.data;
      if(status === STATUS.MEETING_STARTED) {
        setRoom(call)
        setData({
          user: user
        });
        setFullScreen(true);
        setLayout(VIDEO_CALL_LAYOUTS.P2P_VIEW)
      }
    }
    fetchCall();
  },[params, setData, setFullScreen, setLayout, setRoom])
  
  if(!socketConnected) return <PageLoading />

  return (
   <>
    <VideoCall />
    <CommonComponent />
   </>
  );
};

export default HelpDeskCall;
