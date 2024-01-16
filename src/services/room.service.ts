import { get } from "./api.service";

export const getRoomService = (roomId: string) => {
    return get(`/rooms/${roomId}`);
}