export type Room = {
  code: string;
  languages: string[];
  participants: Participant[];
  messages?: Message[];
};

export type Participant = {
  socketId: string;
  username: string;
  language: string;
};

export type Message = {
  sender: Participant;
  content: string;
  translatedContent?: string;
  createdAt: string;
  updatedAt: string;
  isSystem?: boolean;
};
