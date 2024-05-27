import { Room } from '@/features/chat/rooms/types';
import { checkRelationship } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth.store';
import { User } from '@sentry/nextjs';
import { useQuery } from '@tanstack/react-query';
import { UserRelationshipStatus } from '../types';
export const USE_RELATION_KEY = 'user/relation';
export const useRelationship = (
  userId: User['_id'],
  options?: { enabled?: boolean },
) => {
  const { data, error } = useQuery({
    queryKey: [USE_RELATION_KEY, userId],
    queryFn: () => checkRelationship(userId),
    enabled: options?.enabled,
  });
  return {
    data,
    error,
  };
};

export const useCheckRoomRelationship = (room: Room) => {
  const isP2P = room.isGroup === false;
  const currentUser = useAuthStore((s) => s.user);
  const userId = isP2P
    ? room.participants.find((u) => u._id !== currentUser!._id)?._id
    : '';
  const { data, error } = useRelationship(userId!, {
    enabled: !!userId,
  });

  const status = data?.data || 'none';

  return {
    relationshipStatus: status as UserRelationshipStatus,
    error,
  };
};
