import { get, patch, post, put } from './api.service';

export const checkRoomIsHaveMeetingService = (roomId: string) => {
  return post('/call/check-is-have-meeting', { roomId });
};