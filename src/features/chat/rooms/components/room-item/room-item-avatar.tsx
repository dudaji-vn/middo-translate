import { Avatar } from '@/components/data-display/avatar';
import { BellOffIcon } from '@/components/icons';
import { Room } from '@/features/chat//rooms/types';
import { cn } from '@/utils/cn';
import { useMemo } from 'react';

const avatarStyleSizeMapByLength: Record<number, string> = {
  1: 'w-12 h-12 ring-0',
  2: 'w-12 h-12',
  3: 'w-6 h-6',
  4: 'w-6 h-6',
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
    0: 'top-0 left-0 transform w-12 h-12 -translate-x-[calc(50%_+_1px)]',
    1: 'top-0 right-0 transform w-12 h-12 translate-x-[calc(50%_+_1px)]',
  },
  3: {
    0: 'top-0 left-0 transform w-12 h-12 -translate-x-[calc(50%_+_2px)]',
    1: '-top-[1px] right-0 w-6 h-6',
    2: '-bottom-[1px] right-0 w-6 h-6',
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

export const ItemAvatar = ({
  room,
  isOnline = false,
  isMuted = false,
}: {
  room: Room;
  isOnline?: boolean;
  isMuted?: boolean;
}) => {
  const avatars = useMemo(() => {
    const avatars = [];
    const { participants, avatar, isGroup, name, admin } = room;

    if (avatar) {
      avatars.push({
        src: avatar,
        alt: name ?? '',
      });
    } else if (!isGroup) {
      const other = participants.find(
        (participant) => participant._id !== admin?._id,
      );
      if (other) {
        avatars.push({
          src: other.avatar!,
          alt: other.name,
        });
      }
    } else {
      participants.slice(0, MAX_AVATAR_COUNT).forEach((participant) => {
        avatars.push({
          src: participant.avatar!,
          alt: participant.name,
        });
      });
    }

    return avatars;
  }, [room]);

  const avatarsDisplay = useMemo(() => {
    return avatars.slice(0, MAX_AVATAR_COUNT);
  }, [avatars]);
  return (
    <div className="relative">
      <div className="relative aspect-square h-12 shrink-0 overflow-hidden rounded-full">
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
      {isOnline && (
        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-white p-[2.4px]">
          <div className="h-full w-full rounded-full bg-success"></div>
        </div>
      )}
      {isMuted && (
        <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-error-100 ">
          <BellOffIcon width={12} height={12} className="text-error" />
        </div>
      )}
    </div>
  );
};
