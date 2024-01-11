'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { addPeer, createPeer } from '../utils/peer-action.util';
import { ConfirmLeaveRoomModal } from '../components/common/modal-leave-call';
import { RequestJoinRoomModal } from '../components/common/modal-request-join-room';
import { SOCKET_CONFIG } from '@/configs/socket';
import SimplePeer from 'simple-peer';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth';
import toast from 'react-hot-toast';
import { ConfirmStopDoodle } from '../components/common/modal-stop-doodle';
import { LoadingCreatingDoodle } from '../components/common/loading-createing-doodle';
import { useMyVideoCallStore } from '../store/me';
import { useParticipantVideoCallStore } from '../store/participant';
import { useVideoCallStore } from '../store/video-call';
import ParicipantInVideoCall from '../interfaces/participant';
import DEFAULT_USER_CALL_STATE from '../constant/default-user-call-state';
import { ModalSwitchRoom } from '../components/common/modal-switch-room';

interface VideoCallContextProps {
  handleShareScreen: () => void;
  handleStartDoodle: () => void;
}

const VideoCallContext = createContext<VideoCallContextProps>(
  {} as VideoCallContextProps,
);

interface VideoCallProviderProps { }

export const VideoCallProvider = ({
  children,
}: VideoCallProviderProps & PropsWithChildren) => {
  const { user: myInfo } = useAuthStore();
  const {
    setShareScreen,
    setMyStream,
    myStream,
    isShareScreen,
    shareScreenStream,
    setShareScreenStream
  } = useMyVideoCallStore();
  const {
    participants,
    updateParticipant,
    addParticipant,
    removeParticipant,
    removeParticipantShareScreen,
    addUsersRequestJoinRoom,
    removeUsersRequestJoinRoom,
    peerShareScreen,
    addPeerShareScreen,
    clearPeerShareScreen,
    removePeerShareScreen,
    pinParticipant,
    resetParticipants,
    resetUsersRequestJoinRoom
  } = useParticipantVideoCallStore();
  const { room: call, setLayout, setDoodle, setDoodleImage, setMeDoodle, setDrawing, setPinDoodle, isPinDoodle, setPinShareScreen } = useVideoCallStore();
  const [isCreatingDoodle, setIsCreatingDoodle] = useState(false);
  // Start Stream when user access this page
  useEffect(() => {
    let myVideoStream: MediaStream | null = null;
    const navigator = window.navigator as any;
    navigator.mediaDevices
      .getUserMedia({ video: DEFAULT_USER_CALL_STATE.isTurnOnCamera, audio: DEFAULT_USER_CALL_STATE.isTurnOnMic })
      .then((stream: MediaStream) => {
        myVideoStream = stream;
        setMyStream(stream)
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.JOIN, { roomId: call?._id, user: myInfo });
      });
    return () => {
      socket.emit(SOCKET_CONFIG.EVENTS.CALL.LEAVE, call._id);
      if (myVideoStream) {
        myVideoStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      clearPeerShareScreen();
      setShareScreen(false);
      setShareScreenStream(undefined);
      setMyStream(undefined);
      setDoodle(false);
      setDoodleImage('');
      setMeDoodle(false);
      setDrawing(false);
      setPinDoodle(false)
      setPinShareScreen(false)
      setLayout(VIDEOCALL_LAYOUTS.GALLERY_VIEW)
      resetParticipants()
      resetUsersRequestJoinRoom()
    };
  }, [call, clearPeerShareScreen, myInfo, resetParticipants, resetUsersRequestJoinRoom, setDoodle, setDoodleImage, setDrawing, setLayout, setMeDoodle, setMyStream, setPinDoodle, setPinShareScreen, setShareScreen, setShareScreenStream]);

  // useEffect when myStream change
  useEffect(() => {
    if (!socket.id) return;
    if (!myStream) return;
    const me = { stream: myStream, user: myInfo, isMe: true, socketId: socket.id };
    // Event receive list user
    socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT, ({ users, doodleImage }) => {
      users.forEach((user: { id: string; user: any }) => {
        if (user.id === socket.id) return;
        const peer = createPeer({
          id: user.id,
          socketId: socket.id || '',
          user: myInfo,
        });
        peer.addStream(myStream);
        addParticipant({ peer, user: user.user, socketId: user.id, isShareScreen: false });
      });
      addParticipant(me);
      socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN, {
        roomId: call?._id,
        userId: socket.id,
      });
      if (doodleImage) {
        setDoodle(true);
        setDoodleImage(doodleImage);
      }
    });
    // Event have new user join room
    socket.on(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED,
      (payload: {
        signal: SimplePeer.SignalData;
        callerId: string;
        user: any;
        isShareScreen: boolean;
      }) => {
        const peer = addPeer({
          signal: payload.signal,
          callerId: payload.callerId,
          user: myInfo,
          isShareScreen: payload.isShareScreen,
        });
        peer.addStream(myStream);
        const newUser = {
          socketId: payload.callerId,
          peer,
          user: payload.user,
          isShareScreen: payload.isShareScreen,
        };
        if (payload.isShareScreen) {
          setLayout(VIDEOCALL_LAYOUTS.SHARE_SCREEN);
          toast.success(`${payload.user.name} is sharing screen`);
          // const isHavePin = participants.some((p: ParicipantInVideoCall) => p.pin)
          // if(!isHavePin && !isPinDoodle) {
          //   pinParticipant(payload.callerId, true)
          //   setPinShareScreen(true)
          //   setLayout(VIDEOCALL_LAYOUTS.FOCUS_VIEW)
          // }
        } else {
          toast.success(`${payload.user.name} joined meeting`);
        }
        addParticipant(newUser);
      },
    );
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED);
    }
  }, [addParticipant, call?._id, isPinDoodle, myInfo, myStream, participants, pinParticipant, setDoodle, setDoodleImage, setLayout, setPinDoodle, setPinShareScreen, updateParticipant]);

  // useEffect listen event return signal
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL,
      (payload: {
        id: string;
        signal: string;
        user: any;
        isShareScreen: boolean;
      }) => {
        const itemInParticipant = participants.find((p: any) => p.socketId === payload.id && p.isShareScreen === payload.isShareScreen);
        if (itemInParticipant) {
          itemInParticipant.peer.signal(payload.signal);
          return;
        };
        if (!peerShareScreen) return;
        const item = peerShareScreen.find((p: any) => p.id === payload.id);
        if (!item || !item.peer) return;
        item.peer.signal(payload.signal);
      },
    );
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL);
    }
  }, [participants, peerShareScreen]);

  // useEffect Socket Event not effect to stream
  useEffect(() => {
    // Event when have user leave room
    socket.on(SOCKET_CONFIG.EVENTS.CALL.LEAVE, (socketId: string) => {
      const items = participants.filter((p: any) => p.socketId === socketId);
      if (items.length > 0) {
        items.forEach((item: any) => {
          if (item.peer) {
            item.peer.destroy();
          }
          removeParticipant(socketId);
        });
      }

      // Check have in share screen peer
      const itemShareScreen = peerShareScreen.find((p: any) => p.id === socketId);
      if (itemShareScreen) {
        itemShareScreen.peer.destroy();
        removePeerShareScreen(socketId)
      }
    });

    // Event when user stop share screen
    socket.on(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN, (socketId: string) => {
      const item = participants.find((p: any) => p.socketId === socketId && p.isShareScreen);
      if (item) {
        item.peer.destroy();
        removeParticipantShareScreen(socketId);
      }
    },
    );

    // Event when have user want to join room
    socket.on(SOCKET_CONFIG.EVENTS.CALL.REQUEST_JOIN_ROOM,
      ({ user, socketId }: { user: any; socketId: string }) => {
        addUsersRequestJoinRoom({ socketId, user });
      },
    );

    // Event when have another user response request join room
    socket.on(SOCKET_CONFIG.EVENTS.CALL.ANSWERED_JOIN_ROOM, (socketId: string) => {
      removeUsersRequestJoinRoom(socketId);
    },
    );

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.LEAVE);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_JOIN_ROOM);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.ANSWERED_JOIN_ROOM);
    }
  }, [addUsersRequestJoinRoom, participants, peerShareScreen, removeParticipant, removeParticipantShareScreen, removePeerShareScreen, removeUsersRequestJoinRoom, setLayout]);

  // useEffect Send Share screen
  useEffect(() => {
    if (!shareScreenStream) return;
    let peersShareScreenTmp: any[] = [];
    socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN,
      (users: any[]) => {
        users.forEach((user: { id: string; user: any }) => {
          if (!socket.id) return;
          const peer = createPeer({
            id: user.id,
            socketId: socket.id,
            user: myInfo,
            isShareScreen: true,
          });
          peer.addStream(shareScreenStream);
          peersShareScreenTmp.push(peer);
          addPeerShareScreen({
            id: user.id,
            peer,
          });
        });
      },
    );
    socket.on(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN, (socketId: string) => {
      if (!socket.id || socketId === socket.id) return;
      const peer = createPeer({
        id: socketId,
        socketId: socket.id,
        user: myInfo,
        isShareScreen: true,
      });
      peer.addStream(shareScreenStream);
      peersShareScreenTmp.push(peer);
      addPeerShareScreen({
        id: socketId,
        peer,
      });
    });
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN);
      if(peersShareScreenTmp && peersShareScreenTmp.length > 0) {
        peersShareScreenTmp.forEach((peer: any) => {
          if (!peer) return;
          peer.destroy();
        });
      }
    }
  }, [addPeerShareScreen, myInfo, shareScreenStream])
  // Cleanup sharescreen stream
  useEffect(() => {
    return () => {
      if (!shareScreenStream) return;
      shareScreenStream.getTracks().forEach((track: any) => {
        track.stop();
      });
    };
  }, [shareScreenStream]);

  // Doodle Event
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.CALL.START_DOODLE, (payload: { image_url: string, name: string }) => {
      toast.success(payload.name + ' is start doodle');
      setDoodle(true);
      setDoodleImage(payload.image_url);
      const isHavePin = participants.some((p: ParicipantInVideoCall) => p.pin)
      if (!isHavePin) {
        setPinDoodle(true)
        setLayout(VIDEOCALL_LAYOUTS.FOCUS_VIEW)
      }
    });
    socket.on(SOCKET_CONFIG.EVENTS.CALL.END_DOODLE, (name: string) => {
      toast.success(name + ' is stop doodle');
      setDoodle(false);
      setDrawing(false);
      setDoodleImage('');
      setPinDoodle(false)

      setLayout(VIDEOCALL_LAYOUTS.GALLERY_VIEW)
    });
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.START_DOODLE);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.END_DOODLE);
    }
  }, [participants, setDoodle, setDoodleImage, setDrawing, setLayout, setPinDoodle]);

  // useContext function
  const stopShareScreen = () => {
    if (!socket.id) return;
    if (shareScreenStream) {
      shareScreenStream.getTracks().forEach((track: any) => {
        track.stop();
      });
    }
    setShareScreen(false);
    removeParticipantShareScreen(socket.id);
    socket.emit(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
    socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN);
    socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN);

    peerShareScreen.forEach((peer: any) => {
      if (!peer.peer) return;
      peer.peer.destroy();
    })
    clearPeerShareScreen();
  }
  const handleShareScreen = () => {
    // if (participants.some((participant) => participant.isShareScreen)) return;
    if (isShareScreen) {
      stopShareScreen();
      return;
    }
    const navigator = window.navigator as any;
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then(async (stream: MediaStream) => {
        if (!socket.id) return;
        const shareScreen = {
          stream,
          user: myInfo,
          isMe: true,
          isShareScreen: true,
          socketId: socket.id,
        };
        addParticipant(shareScreen);
        setShareScreen(true);
        setShareScreenStream(stream);
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.SHARE_SCREEN, call?._id);
        stream.getVideoTracks()[0].onended = () => {
          if (!socket.id) return;
          stopShareScreen();
        };
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const handleStartDoodle = async () => {
    setIsCreatingDoodle(true);
    let videoEl = document.querySelector('.focus-view video') as HTMLVideoElement;
    if (!videoEl) return;
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    canvas.getContext('2d')?.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const quality = 0.2;
    const dataURL = canvas.toDataURL('image/png', quality);
    // const fileImage = new File([dataURL], 'doodle.png', { type: 'image/png' });
    // const image = await uploadImage(fileImage);
    // if (!image) return;
    setMeDoodle(true);
    socket.emit(SOCKET_CONFIG.EVENTS.CALL.START_DOODLE, {
      image_url: dataURL,
      name: myInfo?.name,
    });
    setIsCreatingDoodle(false);
    setPinDoodle(true)
  }

  return (
    <VideoCallContext.Provider
      value={{
        handleShareScreen: handleShareScreen,
        handleStartDoodle: handleStartDoodle,
      }}
    >
      {isCreatingDoodle && <LoadingCreatingDoodle />}
      <ConfirmLeaveRoomModal />
      <RequestJoinRoomModal />
      <ConfirmStopDoodle />
      <ModalSwitchRoom />
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
