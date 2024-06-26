import { Button } from '@/components/actions';
import { InfiniteScrollWithLoading } from '@/components/infinity-scroll/infinity-scroll-with-loading';
import { Skeleton } from '@/components/ui/skeleton';
import { Message } from '@/features/chat/messages/types';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { Media } from '@/types';
import { PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { Suspense, useMemo } from 'react';
import { roomApi } from '../../api';
import { useChatBox } from '../../contexts';
import { useMediaLightBoxStore } from '@/stores/media-light-box.store';

export interface RoomMediaProps {}

export const RoomMedia = () => {
  const { room } = useChatBox();
  const roomId = room._id;
  const roomStatus = room.status;

  const setIndex = useMediaLightBoxStore((state) => state.setIndex);
  const setFiles = useMediaLightBoxStore((state) => state.setFiles);
  const setFetchNextPage = useMediaLightBoxStore((state) => state.setFetchNextPage);

  const { items, hasNextPage, fetchNextPage, status } =
    useCursorPaginationQuery<Message>({
      queryKey: ['media', roomId],
      queryFn: ({ pageParam }) =>
        roomApi.getMedia({
          roomId: roomId,
          params: { cursor: pageParam, limit: 12 },
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

  const openMediaLightBox = (index: number) => {
    setIndex(index);
    setFiles(media);
    setFetchNextPage(()=>{
      fetchNextPage()
    })
  }

  if (media.length === 0) return null;

  return (
    <>
      <div className="h-full w-full">
        <InfiniteScrollWithLoading
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage || false}
          className="-mb-2 h-full w-full overflow-y-auto"
        >
          <div className="grid w-full grid-cols-4 gap-1">
            {media.map((media, index) => (
              <div
                key={media.url}
                onClick={() => openMediaLightBox(index)}
                className="relative block aspect-square cursor-pointer overflow-hidden rounded-[4px] border border-neutral-50 dark:border-neutral-900"
              >
                {media.type === 'video' && (
                  <div className="relative h-full w-full">
                    <video src={media.url} className="h-full w-full object-cover" />
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
                  <Suspense fallback={<h1>Hello</h1>}>
                    <Image
                      src={media.url}
                      alt={media.name || media.url}
                      quality={50}
                      fill
                      className="object-cover"
                    />
                  </Suspense>
                )}
              </div>
            ))}
            {status === 'loading' &&
              new Array(12).fill(0).map((_, index) => {
                return (
                  <Skeleton
                    key={index}
                    className="relative block aspect-square cursor-pointer overflow-hidden rounded-[4px] border border-neutral-50"
                  />
                );
              })}
          </div>
        </InfiniteScrollWithLoading>
      </div>
      {/* {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          shape="square"
          color="default"
          size="md"
          className="w-full"
        >
          {t('COMMON.SHOW_MORE')}
        </Button>
      )} */}
    </>
  );
};
