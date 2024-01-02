'use client';

import { useAuthStore } from '@/stores/auth';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useVideoCallStore } from '../store';
import peerInstance from './peerInstance';
import socket from '@/lib/socket-io';
import Peer from 'simple-peer'

interface VideoCallProviderProps {
	roomId: string;
}

export const VideoCallProvider = ({ roomId, children }: VideoCallProviderProps & PropsWithChildren) => {
	// const { user } = useAuthStore();
	// const { participants, myPeerId, setMyPeerId, addParticipant, removeParticipant } = useVideoCallStore();
	// const myVideoStreamRef = useRef(null);

	// console.log(participants)
	// useEffect(() => {
	//   peerInstance.on('open', (peerId) => {
	//     setMyPeerId(peerId);
	//     socket.emit('call.join', { peerId, roomId, user });
	//   })

	//   peerInstance.on('error', (err) => console.log(err))

	//   socket.on('call.join', (data) => {
	//     if (!myVideoStreamRef.current) return;
	//     const call = peerInstance.call(data.peerId, myVideoStreamRef.current);
	//     call.on('stream', userStream => {
	//       addParticipant({ peerId: data.peerId, stream: userStream, user: data.user })
	//     })
	//   })
	//   socket.on('call.leave', (peerId) => {
	//     removeParticipant(peerId)
	//   })

	//   const navigator = window.navigator as any;
	//   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
	//     .then((stream: any) => {
	//       if (!myPeerId) return;
	//       myVideoStreamRef.current = stream;
	//       addParticipant({ peerId: myPeerId, stream, user })
	//       peerInstance.on('call', call => {
	//         call.answer(stream);
	//         call.on('stream', userStream => {
	//           // add par
	//           console.log("Add pa")
	//           console.log({ userStream })
	//           addParticipant({ peerId: call.peer, stream: userStream, user })
	//         })
	//         call.on('error', (err) => console.log(err))
	//         call.on("close", () => console.log('Close'))
	//       })
	//     }).catch((err: Error) => console.log(err.message))

	// }, [addParticipant, myPeerId, removeParticipant, roomId, setMyPeerId, user]);

	const { user } = useAuthStore();
	const { participants, updateParticipant } = useVideoCallStore();
	const peersRef = useRef<any>([]);
	useEffect(() => {
		const navigator = window.navigator as any;
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then((stream: MediaStream) => {
				const me = { stream, user, isMe: true}
				
				socket.emit('call.join', { roomId, user });
				socket.on('call.list', users => {
					console.log("Receive List User", users)
					const peers: any[] = [];
					users.forEach((user: {id: string, user: any}) => {
						const peer = createPeer(user.id, user.user, socket.id, stream);
						peersRef.current.push({
							peerId: user.id,
							peer,
							user: user.user,
						});
						peers.push({ peer, user })
					})
					updateParticipant([...peers, me]);
				})

				socket.on('call.user_joined', (payload : {signal: string, callerId: string, user: any}) => {
					const peer = addPeer(payload.signal, payload.callerId, stream, user);
					peersRef.current.push({
						peerId: payload.callerId,
						peer,
						user: payload.user,
					})
					const newUser = {
						peer,
						user: payload.user,
					}
					updateParticipant([...participants, newUser, me]);
				})

				socket.on('call.receive_return_signal', (payload: {id: string, signal: string, user: any}) => {
					const item = peersRef.current.find((p: any)=> p.peerId === payload.id);
					item.peer.signal(payload.signal);
				});
			})
	}, []);

	const createPeer = (id: string, user: any, callerId: string, stream: MediaStream) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});
		peer.on("signal", (signal) => {
			socket.emit("call.send_signal", { id, user, callerId, signal })
		});
		return peer;
	};

	const addPeer = (incomingSignal: string, callerId: string, stream: MediaStream, user: any) => {
		const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
		peer.on("signal", signal => {
            socket.emit("call.return_signal", { signal, callerId, user })
        })
		peer.signal(incomingSignal);

		return peer;
	};

	return (
		<>
			{children}
		</>
	);
};


