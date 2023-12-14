import { Avatar } from '@/components/data-display/avatar';
import { Room } from '@/features/chat//rooms/types';
import { cn } from '@/utils/cn';
import { useMemo } from 'react';

const avatarStyleSizeMapByLength: Record<number | string, string> = {
  1: 'w-24 h-24 ring-0',
  2: 'w-24 h-24',
  3: 'w-12 h-12',
  4: 'w-12 h-12',
};

const avatarStylePositionMapByLengthAndIndex: Record<
  number,
  {
    [key: number]: string;
  }
> = {
  1: {
    0: 'top-0 left-0',
  },
  2: {
    0: 'top-0 left-0 transform w-24 h-24 -translate-x-[calc(50%_+_1px)]',
    1: 'top-0 right-0 transform w-24 h-24 translate-x-[calc(50%_+_1px)]',
  },
  3: {
    0: 'top-0 left-0 transform w-24 h-24 -translate-x-[calc(50%_+_2px)]',
    1: '-top-[1px] right-0 w-12 h-12',
    2: '-bottom-[1px] right-0 w-12 h-12',
  },
  4: {
    0: '-top-[1px] -left-[1px]',
    1: '-top-[1px] -right-[1px]',
    2: '-bottom-[1px] -left-[1px]',
    3: '-bottom-[1px] -right-[1px]',
  },
};

type Avatar = {
  src: string;
  alt: string;
};

const MAX_AVATAR_COUNT = 4;

export const RoomAvatar = ({
  room,
  isOnline = false,
}: {
  room: Room;
  isOnline?: boolean;
}) => {
  const avatars = useMemo(() => {
    const avatars: Avatar[] = [];
    const participants = room.participants;
    if (room.avatar) {
      avatars.push({
        src: room.avatar,
        alt: room.name ?? '',
      });
      return avatars;
    }
    if (!room.isGroup) {
      const other = participants.find(
        (participant) => participant._id !== room.admin._id,
      );
      if (other) {
        avatars.push({
          src: other.avatar!,
          alt: other.name,
        });
        return avatars;
      }
    }
    if (participants.length === 1) {
      avatars.push({
        src: participants[0].avatar!,
        alt: participants[0].name,
      });
    } else if (participants.length > 1) {
      participants.forEach((participant) => {
        avatars.push({
          src: participant.avatar!,
          alt: participant.name,
        });
      });
    }
    return avatars;
  }, [room.participants, room.avatar, room.name]);
  const avatarsDisplay = useMemo(() => {
    if (avatars.length > MAX_AVATAR_COUNT) {
      return avatars.slice(0, MAX_AVATAR_COUNT);
    }
    return avatars;
  }, [avatars]);
  return (
    <div className="relative">
      <div className="relative aspect-square h-24 shrink-0 overflow-hidden rounded-full">
        {avatarsDisplay.map((avatar, index) => (
          <Avatar
            shape="square"
            key={index}
            alt={avatar.alt}
            src={avatar.src}
            className={cn(
              'absolute ring-background',
              avatarStyleSizeMapByLength[avatarsDisplay.length],
              avatarStylePositionMapByLengthAndIndex[avatarsDisplay.length][
                avatars.indexOf(avatar)
              ],
            )}
          />
        ))}
        {avatars.length > MAX_AVATAR_COUNT && (
          <div
            className={cn(
              'absolute bottom-0 flex h-1/2 w-full items-center justify-center bg-black/60 text-sm font-semibold text-background  ring-background',
            )}
          >
            +{avatars.length - MAX_AVATAR_COUNT}
          </div>
        )}
      </div>
    </div>
  );
};
