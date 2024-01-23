'use client';

import { PropsWithChildren, createContext, useContext } from 'react';
import useHandleDoodle from '../hooks/socket/use-handle-doodle';
import useHandleShareScreen from '../hooks/socket/use-handle-share-screen';
import useHandleJoinLeaveCall from '../hooks/socket/use-handle-join-leave-call';
import { CommonComponent } from '../components/common/common';
import useHandleStreamMyVideo from '../hooks/socket/use-handle-stream-my-video';
import useHandleCreatePeerConnection from '../hooks/socket/use-handle-create-peer-connection';

interface VideoCallContextProps {
  handleShareScreen: () => void;
  handleStartDoodle: () => void;
}

const VideoCallContext = createContext<VideoCallContextProps>(
  {} as VideoCallContextProps,
);

export const VideoCallProvider = ({ children }: PropsWithChildren) => {

  const { handleStartDoodle } = useHandleDoodle();
  const { handleShareScreen } = useHandleShareScreen();
  useHandleJoinLeaveCall();
  useHandleStreamMyVideo();
  useHandleCreatePeerConnection();

  return (
    <VideoCallContext.Provider
      value={{
        handleShareScreen: handleShareScreen,
        handleStartDoodle: handleStartDoodle,
      }}
    >
      <CommonComponent />
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCallContext = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error(
      'useVideoCallContext must be used within VideoCallProvider',
    );
  }
  return context;
};
