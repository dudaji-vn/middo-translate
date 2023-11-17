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
    '#ffb503',
    '#01a0d3',
    '#b281b3',
    '#dc2929',
    '#ffdb01',
    '#d6cf05',
    '#8bc43d',
    '#00a450',
    '#01a99d',
    '#01aff0',
    '#0084ca',
    '#015fad',
    '#ff6816',
    '#fe940e',
    '#ffcd02',
    '#c0d742',
    '#00a650',
    '#01a99d',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
