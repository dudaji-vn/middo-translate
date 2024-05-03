import { Button } from '@/components/actions';
import Image from 'next/image';
import { Media } from '@/types';
import { Message } from '@/features/chat/messages/types';
import { RoomStatus } from '../../types';
import { roomApi } from '../../api';
import { useChatBox } from '../../contexts';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { use, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lightbox from "yet-another-react-lightbox";
import Download from 'yet-another-react-lightbox/plugins/download';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

export interface RoomMediaProps {}

export const RoomMedia = () => {
  const { room } = useChatBox();
  const roomId = room._id;
  const roomStatus = room.status;
  const {t} = useTranslation('common');
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
  const slides = useMemo(() => media.map((img) => ({
    src: img.url,
    title: img.name,
    width: 1000,
    height: 1000,
  })), [media]);

  return (
    <>
      <div className=" my-2 grid w-full grid-cols-4 flex-wrap gap-1">
        {media.map((media, index) => (
          <div
            key={media.url}
            onClick={()=>setIndex(index)}
            className="relative aspect-square overflow-hidden rounded-[4px] border border-neutral-50 cursor-pointer"
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
      <Lightbox
        slides={slides}
        index={index}
        open={index !== undefined}
        carousel={{
          finite: false,
        }}
        on={{
          view: ({index}) => {
            setIndex(index);
            if(index >= media.length - 1) {
              fetchNextPage();
            }
          },
        }}
        close={() => setIndex(undefined)}
        plugins={[Download, Thumbnails, Zoom]}
      />
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          shape="square"
          color="default"
          size="lg"
          className="w-full"
        >
          <span className="text-primary-500-main">{t('COMMON.SHOW_MORE')}</span>
        </Button>
      )}
    </>
  );
};
