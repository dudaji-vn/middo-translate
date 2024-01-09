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
      LIST_PARTICIPANT_NEED_ADD_SCREEN: 'call.list_participant_need_add_screen',
      ANSWER_SHARE_SCREEN: 'call.answer_share_screen',
      ICE_CANDIDATE: 'call.ice_candidate',
      STOP_SHARE_SCREEN: 'call.stop_share_screen',
      REQUEST_JOIN_ROOM: 'call.request_join_room',
      ACCEPT_JOIN_ROOM: 'call.accept_join_room',
      REJECT_JOIN_ROOM: 'call.reject_join_room',
      ANSWERED_JOIN_ROOM: 'call.answered_join_room',
      REQUEST_GET_SHARE_SCREEN: 'call.request_get_share_screen',
      START_DOODLE: 'call.start_doodle',
      END_DOODLE: 'call.end_doodle',
      DRAW_DOODLE: 'call.draw_doodle',
      REQUEST_GET_OLD_DOODLE_DATA: 'call.request_get_old_doodle_data',
      SEND_OLD_DOODLE_DATA: 'call.send_old_doodle_data',
    }
  },
};
