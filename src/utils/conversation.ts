import { Participant } from '@/types/room';

export const createParticipant = ({
  username,
  language,
  socketId,
}: {
  username: string;
  language: string;
  socketId: string;
}): Participant => {
  return {
    color: genRandomColor(),
    language,
    username,
    socketId,
  };
};

const genRandomColor = () => {
  const colors = [
    '#d47500',
    '#05aa55',
    '#e3pc01',
    '#01a0d3',
    '#b281b3',
    '#dc2929',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
