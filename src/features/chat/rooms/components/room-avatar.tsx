import { Avatar } from '@/components/data-display/avatar';
import { Room } from '@/features/chat//rooms/types';
import { cn } from '@/utils/cn';
import { useMemo } from 'react';

type Avatar = {
  src: string;
  alt: string;
};

const MAX_AVATAR_COUNT = 4;
const avatarStylePositionMapByLengthAndIndex: Record<
  number | string,
  Record<number | string, string>
> = {
  1: {
    0: 'top-0 left-0',
  },
  2: {
    0: 'top-0 left-0 transform -translate-x-[calc(50%_+_1px)]',
    1: 'top-0 right-0 transform translate-x-[calc(50%_+_1px)]',
  },
  3: {
    0: 'top-0 left-0 transform -translate-x-[calc(50%_+_2px)]',
    1: '-top-[1px] right-0',
    2: '-bottom-[1px] right-0',
  },
  4: {
    0: '-top-[1px] -left-[1px]',
    1: '-top-[1px] -right-[1px]',
    2: '-bottom-[1px] -left-[1px]',
    3: '-bottom-[1px] -right-[1px]',
  },
};

export const RoomAvatar = ({
  room,
  size = 36,
}: {
  room: Room;
  isOnline?: boolean;
  size?: number;
}) => {
  const avatars = useMemo(() => {
    const participants = room.participants;
    if (room.avatar) {
      return [
        {
          src: room.avatar,
          alt: room.name ?? '',
        },
      ];
    }
    if (!room.isGroup) {
      const other = participants.find(
        (participant) => participant._id !== room.admin?._id,
      );
      if (other) {
        return [
          {
            src: other.avatar!,
            alt: other.name,
          },
        ];
      }
    }
    return participants.map((participant) => ({
      src: participant.avatar!,
      alt: participant.name,
    }));
  }, [
    room.participants,
    room.avatar,
    room.isGroup,
    room.name,
    room.admin?._id,
  ]);

  const avatarsDisplay = useMemo(() => {
    return avatars.slice(0, MAX_AVATAR_COUNT);
  }, [avatars]);

  return (
    <div className="relative">
      <div
        style={{
          width: size,
          height: size,
        }}
        className="relative aspect-square shrink-0 overflow-hidden rounded-full"
      >
        {avatarsDisplay.map((avatar, index) => {
          const avtSize = sizeByLengthAndIndex(
            size,
            avatarsDisplay.length,
            index,
          );
          return (
            <Avatar
              shape="square"
              key={index}
              alt={avatar.alt}
              src={avatar.src}
              style={{
                width: avtSize,
                height: avtSize,
              }}
              className={cn(
                'absolute ring-background',
                avatarStylePositionMapByLengthAndIndex[avatarsDisplay.length][
                  avatars.indexOf(avatar)
                ],
              )}
            />
          );
        })}
        {avatars.length > MAX_AVATAR_COUNT && (
          <div
            className={cn(
              'absolute bottom-0 flex h-1/2 w-full items-center justify-center bg-black/60 text-xs text-background  ring-background',
            )}
          >
            +{avatars.length - MAX_AVATAR_COUNT}
          </div>
        )}
      </div>
    </div>
  );
};

const sizeByLengthAndIndex = (
  maxSize: number,
  length: number,
  index: number,
) => {
  switch (length) {
    case 1:
      return maxSize;
    case 2:
      return maxSize / 2;
    case 3:
      return index === 0 ? maxSize : maxSize / 2;
    case 4:
      return maxSize / 2;
    default:
      return maxSize;
  }
};
