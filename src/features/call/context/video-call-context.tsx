'use client';

import { useAuthStore } from '@/stores/auth';
import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from 'react';
import { useVideoCallStore } from '../store';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { addPeer, createPeer } from '../utils/peerAction';
import SimplePeer from 'simple-peer';
import { ConfirmLeaveRoomModal } from '../components/common/ModalLeaveCall';
import { RequestJoinRoomModal } from '../components/common/ModalRequestJoinRoom';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';

interface VideoCallContextProps {
	handleShareScreen: () => void;
}

const VideoCallContext = createContext<VideoCallContextProps>(
	{} as VideoCallContextProps,
);

interface VideoCallProviderProps {
}

export const VideoCallProvider = ({ children }: VideoCallProviderProps & PropsWithChildren) => {
	const { user: myInfo } = useAuthStore();
	const { participants, updateParticipant, addParticipant, removeParticipant, setShareScreen, removeParticipantShareScreen, setRoom, room: call, addUsersRequestJoinRoom, removeUsersRequestJoinRoom, setLayout } = useVideoCallStore();
	const peersRef = useRef<any>([]);
	const [_shareScreenStream, setShareScreenStream] = useState<MediaStream | null>(null);
	useEffect(() => {
		let myVideoStream: MediaStream | null = null;
		const navigator = window.navigator as any;
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then((stream: MediaStream) => {
				myVideoStream = stream;
				const me = { stream, user: myInfo, isMe: true, socketId: socket.id }
				// Event join room
				socket.emit(SOCKET_CONFIG.EVENTS.CALL.JOIN, { roomId: call.slug, user: myInfo });

				// Event receive list user
				socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT, ({users}) => {
					const peers: any[] = [];
					users.forEach((user: {id: string, user: any}) => {
						if (user.id === socket.id) return;
						const peer = createPeer({
							id: user.id,
							socketId: socket.id,
							stream,
							user: myInfo,
						});
						peersRef.current.push({
							peerId: user.id,
							peer,
							user: user.user,
							isShareScreen: false,
						});
						peers.push({ peer, user: user.user, socketId: user.id })
					})
					updateParticipant([...peers, me]);
				})

				// Event have new user join room
				socket.on(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED, (payload : {signal: SimplePeer.SignalData, callerId: string, user: any, isShareScreen: boolean}) => {
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
					})
					const newUser = {
						socketId: payload.callerId,
						peer,
						user: payload.user,
						isShareScreen: payload.isShareScreen,
					}
					if(payload.isShareScreen) {
						setLayout(VIDEOCALL_LAYOUTS.SHARE_SCREEN);
					}
					addParticipant(newUser);
					
				})

				// Event receive return signal
				socket.on(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL, (payload: {id: string, signal: string, user: any, isShareScreen: boolean}) => {
					const item = peersRef.current.find((p: any)=> (p.peerId === payload.id && p.isShareScreen === payload.isShareScreen));
					item.peer.signal(payload.signal);
				});
			})

		// Event when have user leave room
		socket.on(SOCKET_CONFIG.EVENTS.CALL.LEAVE, (socketId: string) => {
			const item = peersRef.current.find((p: any)=> p.peerId === socketId);
			if (item) {
				item.peer.destroy();
				peersRef.current = peersRef.current.filter((p: any)=> p.peerId !== socketId);
				removeParticipant(socketId);
			}
		})

		// Event when have user stop share screen
		socket.on(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN, ({userId}: {userId: string}) => {
			const item = peersRef.current.find((p: any)=> p.peerId === userId && p.isShareScreen);
			if (item) {
				item.peer.destroy();
				peersRef.current = peersRef.current.filter((p: any)=> p.peerId !== userId);
				removeParticipantShareScreen(userId);
				setLayout() // Prev Layout
			}
		});

		// Event when have user want to join room
		socket.on(SOCKET_CONFIG.EVENTS.CALL.REQUEST_JOIN_ROOM, ({user, socketId}: {user: any, socketId: string}) => {
			addUsersRequestJoinRoom({ socketId, user });
		})

		// Event when have another user response request join room
		socket.on(SOCKET_CONFIG.EVENTS.CALL.ANSWERED_JOIN_ROOM, ({userId}: {userId: string}) => {
			removeUsersRequestJoinRoom(userId);
		})

		return () => {
			socket.emit(SOCKET_CONFIG.EVENTS.CALL.LEAVE, call.slug );
			socket.off(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT);
			socket.off(SOCKET_CONFIG.EVENTS.CALL.USER_JOINED);
			socket.off(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL);
			socket.off(SOCKET_CONFIG.EVENTS.CALL.LEAVE);
			socket.off(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
			setRoom(null);
			if(myVideoStream) {
				myVideoStream.getTracks().forEach((track) => {
					track.stop();
				});
			}
			setShareScreenStream((prev: null|MediaStream)=> {
				if(prev) {
					prev.getTracks().forEach((track) => {
						track.stop();
					});
				}
				return null;
			});
		}
	}, [addParticipant, addUsersRequestJoinRoom, call.slug, myInfo, removeParticipant, removeParticipantShareScreen, removeUsersRequestJoinRoom, setLayout, setRoom, setShareScreen, updateParticipant]);

	const handleShareScreen = () => {
		if(participants.some((participant) => participant.isShareScreen)) return;
		const navigator = window.navigator as any;
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(async (stream: MediaStream) => {
            const shareScreen = { stream, user: myInfo, isMe: true, isShareScreen: true, socketId: socket.id}
            addParticipant(shareScreen);
			setShareScreen(true);
			socket.emit(SOCKET_CONFIG.EVENTS.CALL.SHARE_SCREEN, {roomId: call.slug});
			socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT_NEED_ADD_SCREEN, (users: any[]) => {
				setShareScreenStream(stream);
				setLayout(VIDEOCALL_LAYOUTS.SHARE_SCREEN);
				users.forEach((user: {id: string, user: any}) => {
					if (user.id === socket.id) return;
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
			})
			
			stream.getVideoTracks()[0].onended = () => {
				setShareScreen(false);
				removeParticipantShareScreen(socket.id);
				socket.emit(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
				setLayout() // Prev Layout
			}
        }).catch((err: any) => {
            console.log(err);
			setShareScreen(false);
        })
	}

	return (
		<VideoCallContext.Provider value={{
			handleShareScreen: handleShareScreen,
		}}>
			<ConfirmLeaveRoomModal />
			<RequestJoinRoomModal />
			{children}
		</VideoCallContext.Provider>
	);
};

export const useVideoCallContext = () => {
	const context = useContext(VideoCallContext);
	if (!context) {
	  throw new Error('useVideoCallContext must be used within VideoCallProvider');
	}
	return context;
  };


