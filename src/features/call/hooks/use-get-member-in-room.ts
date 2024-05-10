import { useEffect, useState } from "react";
import { User } from "@/features/users/types";
import { getRoomService } from "@/services/room.service";
interface UseGetMemberInRoomProps {
    roomId?: string;
}
export default function useGetMemberInRoom({ roomId }: UseGetMemberInRoomProps) {
    const [members, setMembers] = useState<User[]>([]);

    useEffect(() => {
        if (!roomId) return;
        const fetchMembersInGroup = async () => {
            const res = await getRoomService(roomId)
            const { data } = res;
            setMembers(data?.participants || [])
        }
        fetchMembersInGroup();
    }, [roomId])


    return {
        members
    }
}