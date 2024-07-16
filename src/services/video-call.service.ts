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
export const joinAnonymousVideoCallRoom = () => {
  return post('/call/anonymous');
};
export const joinHelpDeskVideoCallRoom = (data: IJoinHelpDeskVideoCallRoom) => {
  return post('/call/help-desk', { ...data });
};
export const getVideoCall = (callSlug: string) => {
  return get(`/call/${callSlug}`);
};
export const getAnonymousCallInformation = (callId: string) => {
  return get(`/call/${callId}/anonymous`);
}
export const userJoinAnonymousCall = (data: {name: string,language: string, callId: string}) => {
  return post('/call/user-join', { ...data });
}
export const getHelpDeskCallInformation = (roomId: string, userId: string) => {
  return get(`/call/?roomId=${roomId}&userId=${userId}`);
}
