export const SOCKET_CONFIG = {
  EVENTS: {
    MESSAGE: {
      NEW: 'message.new',
      SEND: 'message.send',
      UPDATE: 'message.update',
      DELETE: 'message.delete',
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
    CALL: {
      JOIN: 'call.join',
      LEAVE: 'call.leave',
      LIST_PARTICIPANT: 'call.list',
      SEND_SIGNAL: 'call.send_signal',
      RETURN_SIGNAL: 'call.return_signal',
      USER_JOINED: 'call.user_joined',
      RECEIVE_RETURN_SIGNAL: 'call.receive_return_signal',
      SHARE_SCREEN: 'call.share_screen',
      ANSWER_SHARE_SCREEN: 'call.answer_share_screen',
      ICE_CANDIDATE: 'call.ice_candidate',
      STOP_SHARE_SCREEN: 'call.stop_share_screen',
    }
  },
};
