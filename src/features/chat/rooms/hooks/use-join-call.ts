import { joinVideoCallRoom } from "@/services/video-call.service";
import { useChatBox } from "../contexts";
import { useVideoCallStore } from "@/features/call/store/video-call.store";
import { useAuthStore } from "@/stores/auth.store";
import { STATUS } from "@/features/call/constant/status";
import toast from "react-hot-toast";
import { CALL_TYPE, JOIN_TYPE } from "@/features/call/constant/call-type";
import socket from "@/lib/socket-io";
import { SOCKET_CONFIG } from "@/configs/socket";
import { roomApi } from "../api";
import { useCallback } from "react";

export const useJoinCall = () => {
    const { user } = useAuthStore();
    const { setRoom, room, setTempRoom, setMessageId } = useVideoCallStore();
    const { room: roomChatBox, updateRoom } = useChatBox();
    const createRoomMeeting = useCallback(async () => {
        const res = await roomApi.createRoom({
            participants: roomChatBox.participants.map((p) => p._id),
        });
        updateRoom(res);
        return res._id; // room id
    }, [roomChatBox?.participants, updateRoom]);

    const startVideoCall = useCallback(async (roomId: string) => {
        if (room?.roomId == roomId) return;
        let res = await joinVideoCallRoom({ roomId });
        const data = res?.data;
        if (data.status === STATUS.ROOM_NOT_FOUND) {
            const newRoomId = await createRoomMeeting();
            startVideoCall(newRoomId);
            return;
        }
        if (data.status !== STATUS.JOIN_SUCCESS) {
            toast.error('Error when join room');
            return;
        }
        if (room) {
            // If user is in a meeting => set temp room to show modal
            setTempRoom({
                type: data?.type,
                call: data?.call,
                room: data?.room,
            });
        }
        setRoom(data?.call);
        if (
            data.type == JOIN_TYPE.NEW_CALL &&
            data.call.type === CALL_TYPE.DIRECT
        ) {
            // Get participants id except me
            const participants = data?.room?.participants
                .filter((p: any) => p._id !== user?._id)
                .map((p: any) => p._id);
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, {
                users: participants,
                call: data?.call,
                user: user,
            });
        }
    },[createRoomMeeting, room, setRoom, setTempRoom, user]);

    return startVideoCall;
};
