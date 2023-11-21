export type Room = {
  code: string;
  host: Participant;
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
  englishContent?: string;
  createdAt: string;
  updatedAt: string;
  isSystem?: boolean;
};
