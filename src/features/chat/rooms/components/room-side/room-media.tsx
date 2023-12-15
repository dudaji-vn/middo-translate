import { Button } from '@/components/actions';
import Image from 'next/image';
import { Media } from '@/types';
import { Message } from '@/features/chat/messages/types';
import { RoomStatus } from '../../types';
import { roomApi } from '../../api';
import { useChatBox } from '../../contexts';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useMemo } from 'react';

export interface RoomMediaProps {}

export const RoomMedia = () => {
  const { room } = useChatBox();
  const roomId = room._id;
  const roomStatus = room.status;
  const { items, hasNextPage, fetchNextPage } =
    useCursorPaginationQuery<Message>({
      queryKey: ['media', roomId],
      queryFn: ({ pageParam }) =>
        roomApi.getMedia({
          roomId: roomId,
          params: { cursor: pageParam, limit: 8 },
        }),
      config: {
        enabled: roomStatus !== 'temporary',
      },
    });

  const media = useMemo<Media[]>(() => {
    const media: Media[] = [];
    items.forEach((message) => {
      if (message.type === 'media') {
        media.push(...(message.media || []));
      }
    });
    return media;
  }, [items]);
  return (
    <>
      <div className=" my-2 grid w-full grid-cols-4 flex-wrap gap-1">
        {media.map((media) => (
          <div
            key={media.url}
            className="relative aspect-square overflow-hidden rounded-[4px] border border-colors-neutral-50"
          >
            <Image
              src={media.url}
              alt={media.name || media.url}
              quality={50}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          shape="square"
          color="default"
          size="lg"
          className="w-full"
        >
          <span className="text-colors-primary-500-main">Show more</span>
        </Button>
      )}
    </>
  );
};
