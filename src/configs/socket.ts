export const SOCKET_CONFIG = {
  EVENTS: {
    MESSAGE: {
      NEW: 'message.new',
      SEND: 'message.send',
    },
    ROOM: {
      JOIN: 'room.join',
      LEAVE: 'room.leave',
      PARTICIPANT: {
        UPDATE: 'room.participant.update',
        LEAVE: 'room.participant.leave',
      },
      UPDATE: 'room.update',
      DELETE: 'room.delete',
    },
    CHAT: {
      JOIN: 'chat.join',
      NEW_JOIN: 'chat.newJoin',
      LEAVE: 'chat.leave',
    },
  },
};
