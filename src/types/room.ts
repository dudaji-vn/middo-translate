export type Room = {
  code: string;
  languages: string[];
  participants: Participant[];
};

export type Participant = {
  socketId: string;
  username: string;
  language: string;
};
