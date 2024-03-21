import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import moment from 'moment';

export function generateRoomDisplay(
  room: Room,
  currentUserId: User['_id'],
  inCludeLink?: boolean,
  overridePath?: string | null,
): Room {
  const { participants, isGroup, name } = room;
  const link = inCludeLink ? overridePath || `/talk/${room._id}` : '';
  if (isGroup) {
    if (!name) {
      room.name = participants
        .map((participant) => participant.name.split(' ')[0])
        .join(', ');
    }
    room.link = link;
    room.subtitle = 'Group';
    return room;
  }
  let [participant] = participants.filter(
    (participant) => participant._id !== currentUserId,
  );
  if (!participant) {
    participant = participants[0];
  }

  return {
    ...room,
    name: participant.name,
    subtitle: participant.email,
    avatar: participant.avatar,
    link: inCludeLink ? link : '',
  };
}

export function formatTimeDisplay(time: string) {
  const dateMoment = moment(time);

  if (dateMoment.get('year') !== moment().get('year')) {
    return dateMoment.format('MMM DD, YYYY, LT');
  }
  switch (moment().diff(dateMoment, 'day')) {
    case 0:
      return dateMoment.format('LT');
    case 1:
      return 'Yesterday, ' + dateMoment.format('LT');
    default:
      return dateMoment.format('MMM DD, LT');
  }
}

export function getOtherParticipant(room: Room, currentUserId: User['_id']) {
  return room.participants.find(
    (participant) => participant._id !== currentUserId,
  );
}
