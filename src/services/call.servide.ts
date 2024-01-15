import { get, patch, post, put } from './api.service';

export const checkRoomIsHaveMeetingService = (roomId: string) => {
  return post('/call/check-is-have-meeting', { roomId });
};
export const getCallInfoService = (roomId: string) => {
  return post('/call/get-call-info', { roomId });
}