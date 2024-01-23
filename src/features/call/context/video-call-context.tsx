'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { addPeer, createPeer } from '../utils/peer-action.util';
import { ConfirmLeaveRoomModal } from '../components/common/modal/modal-leave-call';
import { RequestJoinRoomModal } from '../components/common/modal/modal-request-join-room';
import { SOCKET_CONFIG } from '@/configs/socket';
import SimplePeer from 'simple-peer';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import toast from 'react-hot-toast';
import { ConfirmStopDoodle } from '../components/common/modal/modal-stop-doodle';
import { useMyVideoCallStore } from '../store/me.store';
import { useParticipantVideoCallStore } from '../store/participant.store';
import { useVideoCallStore } from '../store/video-call.store';
import ParticipantInVideoCall from '../interfaces/participant';
import DEFAULT_USER_CALL_STATE from '../constant/default-user-call-state';
import { ModalSwitchRoom } from '../components/common/modal/modal-switch-room';
import { ModalAddUser } from '../components/common/modal/modal-add-user';
import SpeechRecognition from 'react-speech-recognition';
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
