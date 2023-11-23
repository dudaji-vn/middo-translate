import { Message, Room } from '@/types/room';

import moment from 'moment';
import socket from '@/lib/socket-io';

export const genChatLogFile = ({
  room,
  messages,
}: {
  room: Room;
  messages: Message[];
}) => {
  let chatLog = 'MIDDO CONVERSATION CHAT LOG\n';
  chatLog += '_________________________________________\n\n';
  let membersText = 'MEMBERS:\n';

  let userIndexBySocketId: { [key: string]: number } = {};
  room.participants.forEach((member, index) => {
    membersText += `${index + 1}. ${member.username} - ${member.language} ${
      room.host.socketId === member.socketId ? '- host' : ''
    }\n`;
    userIndexBySocketId[member.socketId] = index + 1;
  });
  chatLog += membersText;
  chatLog += '_________________________________________\n\n';
  let messagesText = 'MESSAGES:\n';
  messages.forEach((message, index) => {
    messagesText += ` - ${message.sender.username}(${
      userIndexBySocketId[message.sender.socketId]
    })${message.sender.socketId === socket.id && '(you)'}:\n`;
    messagesText += `   + Original: ${message.content}\n`;
    if (message.translatedContent)
      messagesText += `   + Translated: ${message.translatedContent}\n`;
    if (message.englishContent)
      messagesText += `   + English: ${message.englishContent}\n`;
    messagesText += `   + time: ${moment(message.createdAt).format('LT')}\n${
      index === messages.length - 1 ? '' : '\n'
    }`;
  });

  chatLog += messagesText;
  chatLog += '_________________________________________\n\n';
  chatLog += `END`;

  return chatLog;
};
