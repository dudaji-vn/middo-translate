export type Room = {
  code: string;
  hostSocketId: string;
  languages: string[];
  participants: Participant[];
  messages?: Message[];
};

export type Participant = {
  socketId: string;
  username: string;
  language: string;
  color: string;
};

export type Message = {
  sender: Participant;
  content: string;
  translatedContent?: string;
  createdAt: string;
  updatedAt: string;
  isSystem?: boolean;
};
