import { post, get } from './api.service';

type IJoinVideoCallRoom = {
  roomId: string;
}

type IJoinHelpDeskVideoCallRoom = IJoinVideoCallRoom & {
  userId: string;
}

export const joinVideoCallRoom = (data: IJoinVideoCallRoom) => {
  return post('/call', { ...data });
};
export const joinHelpDeskVideoCallRoom = (data: IJoinHelpDeskVideoCallRoom) => {
  return post('/call/help-desk', { ...data });
};
export const getVideoCall = (callSlug: string) => {
  return get(`/call/${callSlug}`);
};

export const getHelpDeskCallInformation = (roomId: string, userId: string) => {
  return get(`/call/?roomId=${roomId}&userId=${userId}`);
}
