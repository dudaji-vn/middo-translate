import { Button } from '@/components/actions';
import { Message } from '@/features/chat/messages/types';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { Media } from '@/types';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { roomApi } from '../../api';
import { useChatBox } from '../../contexts';
import { MediaPreview } from '@/components/media-preview';
import { PlayIcon } from 'lucide-react';

export interface RoomMediaProps {}

export const RoomMedia = () => {
  const { room } = useChatBox();
  const roomId = room._id;
  const roomStatus = room.status;
  const { t } = useTranslation('common');
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

  const [index, setIndex] = useState<number | undefined>(undefined);
  if (media.length === 0) return null;
  return (
    <>
      <div className="mb-3 grid w-full grid-cols-4 flex-wrap gap-1">
        {media.map((media, index) => (
          <div
            key={media.url}
            onClick={() => setIndex(index)}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-[4px] border border-neutral-50"
          >
            {media.type === 'video' && (
              <div className="relative h-full w-full">
                <video src={media.url} className="h-full w-full" />
                <Button.Icon
                  size={'ss'}
                  variant={'default'}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-50"
                  color={'default'}
                >
                  <PlayIcon />
                </Button.Icon>
              </div>
            )}
            {media.type === 'image' && (
              <Image
                src={media.url}
                alt={media.name || media.url}
                quality={50}
                fill
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>
      <MediaPreview
        files={media}
        index={index}
        close={() => setIndex(undefined)}
        fetchNextPage={hasNextPage ? fetchNextPage : undefined}
      />
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          shape="square"
          color="default"
          size="md"
          className="w-full"
        >
          {t('COMMON.SHOW_MORE')}
        </Button>
      )}
    </>
  );
};
