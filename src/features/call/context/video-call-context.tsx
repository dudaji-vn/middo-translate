'use client';

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addPeer, createPeer } from '../utils/peerAction';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { ConfirmLeaveRoomModal } from '../components/common/ModalLeaveCall';
import { RequestJoinRoomModal } from '../components/common/ModalRequestJoinRoom';
import { SOCKET_CONFIG } from '@/configs/socket';
import SimplePeer from 'simple-peer';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth';
import { ParicipantInVideoCall, useVideoCallStore } from '../store';
import toast from 'react-hot-toast';
import { ConfirmStopDoodle } from '../components/common/ModalStopDoodle';
import { uploadImage } from '@/utils/upload-img';
import { LoadingCreatingDoodle } from '../components/common/LoadingCreatingDoodle';

interface VideoCallContextProps {
  handleShareScreen: () => void;
  handleToggleCamera: (status: boolean) => void;
  handleToggleMute: (status: boolean) => void;
  handleStartDoodle: () => void;
}

const VideoCallContext = createContext<VideoCallContextProps>(
  {} as VideoCallContextProps,
);

interface VideoCallProviderProps {}

export const VideoCallProvider = ({
  children,
}: VideoCallProviderProps & PropsWithChildren) => {
  const { user: myInfo } = useAuthStore();
  const {
    participants,
    updateParticipant,
    addParticipant,
    removeParticipant,
    setShareScreen,
    removeParticipantShareScreen,
    setRoom,
    room: call,
    addUsersRequestJoinRoom,
    removeUsersRequestJoinRoom,
    setLayout,
    setDoodle,
    setDoodleImage,
    setMeDoodle
  } = useVideoCallStore();
  const peersRef = useRef<any>([]);
  const [_shareScreenStream, setShareScreenStream] = useState<MediaStream | null>(null);
  const [ isCreatingDoodle, setIsCreatingDoodle ] = useState(false);
  useEffect(() => {
    let myVideoStream: MediaStream | null = null;
    const navigator = window.navigator as any;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        myVideoStream = stream;
        const me = { stream, user: myInfo, isMe: true, socketId: socket.id };
        // Event join room
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.JOIN, {
          roomId: call.slug,
          user: myInfo,
        });

        // Event receive list user
        socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT, ({ users }) => {
          const peers: any[] = [];
          users.forEach((user: { id: string; user: any }) => {
            if (user.id === socket.id) return;
            const peer = createPeer({
              id: user.id,
              socketId: socket.id || '',
              stream,
              user: myInfo,
            });
            peersRef.current.push({
              peerId: user.id,
              peer,
              user: user.user,
              isShareScreen: false,
            });
            peers.push({ peer, user: user.user, socketId: user.id });
          });
          updateParticipant([...peers, me]);
          socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN, {
            roomId: call.slug,
            userId: socket.id,
          });
        });

        // Event have new user join room
        socket.on(
          SOCKET_CONFIG.EVENTS.CALL.USER_JOINED,
          (payload: {
            signal: SimplePeer.SignalData;
            callerId: string;
            user: any;
            isShareScreen: boolean;
          }) => {
            const peer = addPeer({
              signal: payload.signal,
              callerId: payload.callerId,
              stream,
              user: myInfo,
              isShareScreen: payload.isShareScreen,
            });
            peersRef.current.push({
              peerId: payload.callerId,
              peer,
              user: payload.user,
              isShareScreen: payload.isShareScreen,
            });
            const newUser = {
              socketId: payload.callerId,
              peer,
              user: payload.user,
              isShareScreen: payload.isShareScreen,
            };
            if (payload.isShareScreen) {
              setLayout(VIDEOCALL_LAYOUTS.SHARE_SCREEN);
              toast.success(`${payload.user.name} is sharing screen`);
            }
            addParticipant(newUser);
          },
        );

        // Event receive return signal
        socket.on(
          SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL,
          (payload: {
            id: string;
            signal: string;
            user: any;
            isShareScreen: boolean;
          }) => {
            const item = peersRef.current.find(
              (p: any) =>
                p.peerId === payload.id &&
                p.isShareScreen === payload.isShareScreen,
            );
            item.peer.signal(payload.signal);
          },
        );
      });

    // Event when have user leave room
    socket.on(SOCKET_CONFIG.EVENTS.CALL.LEAVE, (socketId: string) => {
      const item = peersRef.current.find((p: any) => p.peerId === socketId);
      if (item) {
        item.peer.destroy();
        peersRef.current = peersRef.current.filter(
          (p: any) => p.peerId !== socketId,
        );
        removeParticipant(socketId);
      }
    });

    // Event when have user stop share screen
    socket.on(
      SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN,
      ({ userId }: { userId: string }) => {
        const item = peersRef.current.find(
          (p: any) => p.peerId === userId && p.isShareScreen,
        );
        if (item) {
          item.peer.destroy();
          peersRef.current = peersRef.current.filter(
            (p: any) => p.peerId !== userId,
          );
          removeParticipantShareScreen(userId);
          setLayout(); // Prev Layout
        }
      },
    );

    // Event when have user want to join room
    socket.on(
      SOCKET_CONFIG.EVENTS.CALL.REQUEST_JOIN_ROOM,
      ({ user, socketId }: { user: any; socketId: string }) => {
        addUsersRequestJoinRoom({ socketId, user });
      },
    );

    // Event when have another user response request join room
    socket.on(
      SOCKET_CONFIG.EVENTS.CALL.ANSWERED_JOIN_ROOM,
      ({ userId }: { userId: string }) => {
        removeUsersRequestJoinRoom(userId);
      },
    );

    return () => {
      socket.emit(SOCKET_CONFIG.EVENTS.CALL.LEAVE, call.slug);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.LEAVE);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
      setRoom(null);
      if (myVideoStream) {
        myVideoStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      setShareScreenStream((prev: null | MediaStream) => {
        if (prev) {
          prev.getTracks().forEach((track) => {
            track.stop();
          });
        }
        return null;
      });
    };
  }, [
    addParticipant,
    addUsersRequestJoinRoom,
    call.slug,
    myInfo,
    removeParticipant,
    removeParticipantShareScreen,
    removeUsersRequestJoinRoom,
    setLayout,
    setRoom,
    setShareScreen,
    updateParticipant,
  ]);
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.CALL.START_DOODLE, ({image_url}: {image_url: string}) => {
       setDoodle(true);
       setDoodleImage(image_url);
    });
  }, [setDoodle, setDoodleImage]);

  const handleShareScreen = () => {
    if (participants.some((participant) => participant.isShareScreen)) return;
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
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.SHARE_SCREEN, {
          roomId: call.slug,
        });
        socket.on(
          SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN,
          (users: any[]) => {
            setShareScreenStream(stream);
            setLayout(VIDEOCALL_LAYOUTS.SHARE_SCREEN);
            users.forEach((user: { id: string; user: any }) => {
              if (!socket.id) return;
              const peer = createPeer({
                id: user.id,
                socketId: socket.id,
                stream,
                user: myInfo,
                isShareScreen: true,
              });
              peersRef.current.push({
                peerId: user.id,
                peer,
                user: user.user,
                isShareScreen: true,
              });
            });
          },
        );

        socket.on(
          SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_SHARE_SCREEN,
          ({ userId }: { userId: string }) => {
            if (!socket.id || userId === socket.id) return;
            const peer = createPeer({
              id: userId,
              socketId: socket.id,
              stream,
              user: myInfo,
              isShareScreen: true,
            });
            peersRef.current.push({
              peerId: userId,
              peer,
              user: myInfo,
              isShareScreen: true,
            });
          },
        );
        stream.getVideoTracks()[0].onended = () => {
          if (!socket.id) return;
          setShareScreen(false);
          removeParticipantShareScreen(socket.id);
          socket.emit(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
          setLayout(); // Prev Layout
        };
      })
      .catch((err: any) => {
        console.log(err);
        setShareScreen(false);
      });
  };
  const handleToggleCamera = (status: boolean) => {
    participants.forEach((participant: ParicipantInVideoCall) => {
      if(participant.isShareScreen) return;
      if(!participant.isMe) return;
      if(!participant?.stream) return;
      participant.stream.getVideoTracks()[0].enabled = status;
      // if(status) {
      //   const navigator = window.navigator as any;
      //   console.log('TUrn on camera with status', status, isMute);
      //   navigator.mediaDevices
      //     .getUserMedia({ video: true, audio: !isMute})
      //     .then((stream: MediaStream) => {
      //       participant.stream = stream;
      //       setStreamForParticipant(stream, participant.socketId, true)
      //     });
      // } else {
      //   console.log('TUrn off camera');
      //   console.log(participant.stream.getVideoTracks()[0])
      //   participant.stream.getVideoTracks()[0].stop();
      //   // participant.stream.getVideoTracks()[0].enabled = false;
      //   setStreamForParticipant(new MediaStream(), participant.socketId, true)
      // }
    });
  }
  const handleToggleMute = (status: boolean) => {
    participants.forEach((participant: ParicipantInVideoCall) => {
      if(participant.isShareScreen) return;
      if(!participant.isMe) return;
      if(!participant?.stream) return;
      participant.stream.getAudioTracks()[0].enabled = status;
      // if(!status) {
      //   console.log('TUrn off mic');
      //   participant.stream.getAudioTracks()[0].stop();
      // }else {
      //   const navigator = window.navigator as any;
      //   console.log('TUrn on mic with status', status, isTurnOnCamera);
      //   navigator.mediaDevices
      //     .getUserMedia({ video: isTurnOnCamera, audio: true })
      //     .then((stream: MediaStream) => {
      //       setStreamForParticipant(stream, participant.socketId, true)
      //     });
      // }
    });
  }
  const handleStartDoodle = async () => {
    setIsCreatingDoodle(true);
    let videoEl = document.querySelector('.focus-view video') as HTMLVideoElement;
    if(!videoEl) return;
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL();
    const fileImage = new File([dataURL], 'doodle.png', {type: 'image/png'});
    const image = await uploadImage(fileImage);
    if(!image) return;
    setMeDoodle(true);
    socket.emit(SOCKET_CONFIG.EVENTS.CALL.START_DOODLE, {image_url: image.secure_url});
    setIsCreatingDoodle(false);
  }
  return (
    <VideoCallContext.Provider
      value={{
        handleShareScreen: handleShareScreen,
        handleToggleCamera: handleToggleCamera,
        handleToggleMute: handleToggleMute,
        handleStartDoodle: handleStartDoodle,
      }}
    >
      {isCreatingDoodle && <LoadingCreatingDoodle />}
      <ConfirmLeaveRoomModal />
      <RequestJoinRoomModal />
      <ConfirmStopDoodle />
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
