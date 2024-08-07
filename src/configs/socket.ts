export const SOCKET_CONFIG = {
  EVENTS: {
    CLIENT: {
      JOIN: 'client.join',
      LEAVE: 'client.leave',
      LIST: 'client.list',
    },
    MESSAGE: {
      NEW: 'message.new',
      SEND: 'message.send',
      UPDATE: 'message.update',
      UNREAD_UPDATE: 'message.unread_update',
      DELETE: 'message.delete',
      FORM: {
        UPDATE: 'message.form.update',
      },
      REPLY: {
        NEW: 'message.reply.new',
        JOIN: 'message.reply.join',
        LEAVE: 'message.reply.leave',
        UPDATE: 'message.reply.update',
        REMOVE: 'message.reply.remove',
        COUNT: 'message.reply.count',
      },
      PIN: 'message.pin',
    },
    ROOM: {
      NEW: 'room.new',
      JOIN: 'room.join',
      LEAVE: 'room.leave',
      PARTICIPANT: {
        UPDATE: 'room.participant.update',
        LEAVE: 'room.participant.leave',
      },
      UPDATE: 'room.update',
      DELETE: 'room.delete',
      DELETE_CONTACT: 'room.delete_contact',
      WAITING_UPDATE: 'room.waiting_update',
    },
    INBOX: {
      NEW: 'inbox.new',
      UPDATE: 'inbox.update',
      DELETE: 'inbox.delete',
    },
    CHAT: {
      JOIN: 'chat.join',
      NEW_JOIN: 'chat.newJoin',
      LEAVE: 'chat.leave',
    },
    CALL: {
      JOIN: 'call.join',
      START: 'call.start',
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
      SEND_DOODLE_SHARE_SCREEN: 'call.send_doodle_share_screen',
      STARTING_NEW_CALL: 'call.starting_new_call',
      MEETING_END: 'call.meeting_end',
      INVITE_TO_CALL: 'call.invite_to_call',
      DECLINE_CALL: 'call.decline_call',
      LIST_WAITING_CALL: 'call.list_waiting_call',
      SEND_CAPTION: 'call.send_caption',
      UPDATE: 'call.update',
      CALL_STATUS: {
        MIC_CHANGE: 'call.status.mic_change',
      },
    },
    SPEECH_TO_TEXT: {
      START: 'speech_to_text.start',
      STOP: 'speech_to_text.stop',
      SEND_AUDIO: 'speech_to_text.send_audio',
      RECEIVE_AUDIO_TEXT: 'speech_to_text.receive_audio_text',
    },
    TYPING: {
      UPDATE: {
        SERVER: 'typing.update.server',
        CLIENT: 'typing.update.client',
      },
    },
    SPACE: {
      NOTIFICATION: {
        NEW: 'space.notification.new',
      },
      REMOVE_MEMBER: 'space.member.remove',
      UPDATE: 'space.update',
    },
    STATION: {
      NOTIFICATION: {
        NEW: 'space.notification.new',
      },
      MEMBER: {
        REMOVE: 'station.member.remove',
        LEAVE: 'station.member.leave',
        UPDATE: 'station.member.update',
      },
      UPDATE: 'station.update',
    },
    USER: {
      RELATIONSHIP: {
        UPDATE: 'user.relationship.update',
      },
    },
    MEETING: {
      LIST: 'meeting.list',
      UPDATE: 'meeting.update',
      END: 'meeting.end',
      BLOCK: 'meeting.block',
    },
    APP: {
      NOTIFICATION: {
        NEW: 'app.notification.new',
      },
    },
  },
};
