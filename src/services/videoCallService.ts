import { post, get } from "./apiService";

export const joinVideoCallRoom = (data: any) => {
    return post('/call', { ...data });
};
export const getVideoCall = (callSlug: string) => {
    return get(`/call/${callSlug}`);
}