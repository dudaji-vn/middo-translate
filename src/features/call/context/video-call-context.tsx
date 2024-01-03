'use client';

import { useAuthStore } from '@/stores/auth';
import { PropsWithChildren, createContext, useContext, useEffect, useRef } from 'react';
import { useVideoCallStore } from '../store';
import socket from '@/lib/socket-io';
import Peer from 'simple-peer'
import { SOCKET_CONFIG } from '@/configs/socket';
import { addPeer, createPeer } from '../utils/peerAction';
import SimplePeer from 'simple-peer';

interface VideoCallContextProps {
	handleShareScreen: () => void;
}

const VideoCallContext = createContext<VideoCallContextProps>(
	{} as VideoCallContextProps,
);

interface VideoCallProviderProps {
	roomId: string;
}

export const VideoCallProvider = ({ roomId, children }: VideoCallProviderProps & PropsWithChildren) => {
	const { user: myInfo } = useAuthStore();
	const { participants, updateParticipant, addParticipant, removeParticipant, setRoomId, setShareScreen, removeParticipantShareScreen, setRoom } = useVideoCallStore();
	const peersRef = useRef<any>([]);
	// const shareScreenRef = useRef<any>([]);
	// console.log({participants})
	useEffect(() => {
		// shareScreenRef.current = new RTCPeerConnection({'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]});
		setRoomId(roomId);
		const navigator = window.navigator as any;
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then((stream: MediaStream) => {
				const me = { stream, user: myInfo, isMe: true, socketId: socket.id }
				// Event join room
				socket.emit(SOCKET_CONFIG.EVENTS.CALL.JOIN, { roomId, user: myInfo });

				// Event receive list user
				socket.on(SOCKET_CONFIG.EVENTS.CALL.LIST_PARTICIPANT, ({users, room}) => {
					setRoom(room);
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
					console.log('Have user Join room', payload)
					// if(payload.signal.type === 'offer') return;
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
					addParticipant(newUser);
				})

				// Event receive return signal
				socket.on(SOCKET_CONFIG.EVENTS.CALL.RECEIVE_RETURN_SIGNAL, (payload: {id: string, signal: string, user: any, isShareScreen: boolean}) => {
					const item = peersRef.current.find((p: any)=> (p.peerId === payload.id && p.isShareScreen === payload.isShareScreen));
					item.peer.signal(payload.signal);
				});

				// Event when have user leave room
				socket.on(SOCKET_CONFIG.EVENTS.CALL.LEAVE, (socketId: string) => {
					const item = peersRef.current.find((p: any)=> p.peerId === socketId);
					if (item) {
						item.peer.destroy();
						peersRef.current = peersRef.current.filter((p: any)=> p.peerId !== socketId);
						removeParticipant(socketId);
					}
				})

				socket.on(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN, ({userId}: {userId: string}) => {
					const item = peersRef.current.find((p: any)=> p.peerId === userId && p.isShareScreen);
					if (item) {
						item.peer.destroy();
						peersRef.current = peersRef.current.filter((p: any)=> p.peerId !== userId);
						removeParticipantShareScreen(userId);
					}
				});
			})
		
		return () => {
			socket.emit(SOCKET_CONFIG.EVENTS.CALL.LEAVE, roomId );
		}
	}, []);

	const handleShareScreen = () => {
		const navigator = window.navigator as any;
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(async (stream: MediaStream) => {
            const shareScreen = { stream, user: myInfo, isMe: true, isShareScreen: true, socketId: socket.id}
            addParticipant(shareScreen);
			setShareScreen(true);
			// if(!shareScreenRef.current) return;
			socket.emit(SOCKET_CONFIG.EVENTS.CALL.SHARE_SCREEN, {roomId});
			socket.on("call.list_participant_need_add_screen", (users: any[]) => {
				// console.log('list_participant_need_add_screen', users)
				users.forEach((user: {id: string, user: any}) => {
					if (user.id === socket.id) return;
					console.log('Create peer for user', user)
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
			// shareScreenRef.current.addTrack(stream.getVideoTracks()[0], stream);
			// const sdp = await shareScreenRef.current.createOffer();
            // await shareScreenRef.current.setLocalDescription(sdp);
            // socket.emit(SOCKET_CONFIG.EVENTS.CALL.SHARE_SCREEN, shareScreenRef.current.localDescription);

			// peersRef.current.forEach((peer: any) => {
			// 	if(peer.peerId === socket.id) return;
			// 	// peer.peer.replaceTrack(peer.peer.streams[0].getVideoTracks()[0], stream.getVideoTracks()[0], peer.peer.streams[0]);
			// 	// peer.peer.addTrack(stream.getVideoTracks()[0], stream);
			// 	// add one more track
			// 	peer.peer.emit('share-screen', stream)
				
			// });

			stream.getVideoTracks()[0].onended = () => {
				setShareScreen(false);
				removeParticipantShareScreen(socket.id);
				socket.emit(SOCKET_CONFIG.EVENTS.CALL.STOP_SHARE_SCREEN);
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
			{children}
		</VideoCallContext.Provider>
	);
};

export const useVideoCallContext = () => {
	const context = useContext(VideoCallContext);
	if (!context) {
	  throw new Error('useMessagesBox must be used within MessagesBoxProvider');
	}
	return context;
  };


