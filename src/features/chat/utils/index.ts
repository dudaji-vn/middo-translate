import { User } from '@/features/users/types';

export function getReadByUsers({
  senderId,
  currentUserId,
  participants,
  readBy,
  includeCurrentUser = false,
  showOthers = true,
}: {
  senderId: User['_id'];
  currentUserId: User['_id'];
  participants: User[];
  readBy: User['_id'][];
  includeCurrentUser?: boolean;
  showOthers?: boolean;
}) {
  const readByClone = [...readBy];

  if (readByClone.length === 0) {
    return [];
  }

  if (!includeCurrentUser) {
    const currentUserIdIndex = readByClone.indexOf(currentUserId);
    if (currentUserIdIndex !== -1) {
      readByClone.splice(currentUserIdIndex, 1);
    }
  }

  const readByUsers = participants.filter((participant) => {
    if (participant._id === senderId) {
      return false;
    }
    if (
      !showOthers &&
      participant._id !== currentUserId &&
      currentUserId !== senderId
    ) {
      return false;
    }
    return readByClone.includes(participant._id);
  });

  return readByUsers;
}
