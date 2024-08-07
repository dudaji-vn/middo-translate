'use client';

import { PropsWithChildren, createContext, useContext } from 'react';
import useHandleDoodle from '../hooks/socket/use-handle-doodle';
import useHandleShareScreen from '../hooks/socket/use-handle-share-screen';
import useHandleJoinLeaveCall from '../hooks/socket/use-handle-join-leave-call';
import useHandleStreamMyVideo from '../hooks/socket/use-handle-stream-my-video';
import useHandleCreatePeerConnection from '../hooks/socket/use-handle-create-peer-connection';
import usePeerEvent from '../hooks/socket/use-peer-event';
import useHandleEventElectron from '../hooks/electron/use-handle-event-electron';
import useHandleCallStatus from '../hooks/socket/use-handle-call-status';
import useAudioRinging from '../hooks/side-effect/use-audio-ringing';

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
  usePeerEvent();
  useHandleCallStatus();
  useAudioRinging()
  // For electron
  useHandleEventElectron();

  return (
    <VideoCallContext.Provider
      value={{
        handleShareScreen: handleShareScreen,
        handleStartDoodle: handleStartDoodle,
      }}
    >
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
