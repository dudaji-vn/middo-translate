export const socketConfig = {
  events: {
    message: {
      new: 'message.new',
      send: 'message.send',
    },
    room: {
      join: 'room.join',
      leave: 'room.leave',
      participant: {
        update: 'room.participant.update',
        leave: 'room.participant.leave',
      },
    },
    chat: {
      join: 'chat.join',
      newJoin: 'chat.newJoin',
      leave: 'chat.leave',
    },
  },
};
