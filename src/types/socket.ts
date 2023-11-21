import { Message, Participant } from './room';

export type SendMessagePayload = {
  roomCode: string;
  message: Pick<Message, 'content' | 'translatedContent'>;
};

export type JoinRoomPayload = {
  roomCode: string;
  info: Omit<Participant, 'socketId'>;
};
