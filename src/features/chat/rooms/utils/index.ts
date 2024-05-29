import { Room, RoomStatus } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import moment from 'moment';

export function generateRoomDisplay(
  room: Room,
  currentUserId: User['_id'],
  inCludeLink?: boolean,
  overridePath?: string | null,
): Room {
  const { participants, isGroup, name, waitingUsers = [] } = room;
  const combinedParticipants = participants.concat(waitingUsers || []);

  const link = inCludeLink ? overridePath || `/talk/${room._id}` : '';
  let status: RoomStatus = room.status;

  if (status !== 'temporary' && !room.isHelpDesk) {
    if (isGroup) {
      const isInWaitingList = waitingUsers.some(
        (user) => user._id.toString() === currentUserId,
      );
      if (isInWaitingList) {
        status = 'waiting';
      }
    } else if (waitingUsers.length > 0) {
      status = 'waiting';
    }
  }

  if (isGroup) {
    return {
      ...room,
      link,
      subtitle: 'Group',
      status,
      ...(name
        ? { name }
        : {
            name: combinedParticipants
              .map((participant) => participant.name.split(' ')[0])
              .join(', '),
          }),
    };
  }
  let [participant] = combinedParticipants.filter(
    (participant) => participant._id !== currentUserId,
  );
  if (!participant) {
    participant = combinedParticipants[0];
  }

  return {
    ...room,
    name: participant.name,
    subtitle: '@' + participant.username,
    avatar: participant.avatar,
    link: inCludeLink ? link : '',
    status,
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
