import { Avatar, AvatarGroup } from '@/components/data-display/avatar';

import { Message } from '@/features/chat/messages/types';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { getReadByUsers } from '@/features/chat/utils';
import { useMemo } from 'react';

export const ItemSub = ({
  message,
  participants,
  currentUserId,
}: {
  message: Message;
  participants: User[];
  currentUserId: User['_id'];
}) => {
  const isRead = message.readBy?.includes(currentUserId);
  const readByUsers = useMemo(() => {
    return getReadByUsers({
      readBy: message.readBy ?? [],
      participants,
      currentUserId,
      senderId: message.sender._id,
      showOthers: false,
    });
  }, [message.readBy, message.sender._id, participants, currentUserId]);

  const preMessage = useMemo(() => {
    if (message.sender._id === currentUserId) {
      return 'You:';
    }
    if (participants.length > 2) {
      return `${message.sender.name}:`;
    }
    return '';
  }, [
    message.sender._id,
    message.sender.name,
    currentUserId,
    participants.length,
  ]);

  return (
    <div className="flex items-center">
      <Typography
        className={cn(
          'line-clamp-1 break-all text-sm',
          isRead ? 'text-text/50' : 'font-bold  text-text/90',
        )}
      >
        {preMessage} {message?.content}
      </Typography>
      {readByUsers.length > 0 && (
        <div className="ml-auto flex items-center pl-2">
          <AvatarGroup
            avatarClassName="w-4 h-4"
            className="text-[0.625rem]"
            limit={2}
          >
            {readByUsers.map((user) => (
              <Avatar key={user._id} alt={user.name} src={user.avatar} />
            ))}
          </AvatarGroup>
        </div>
      )}
    </div>
  );
};
