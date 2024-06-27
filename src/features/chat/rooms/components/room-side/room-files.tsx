import { Button } from '@/components/actions';
import { File } from 'lucide-react';
import { Media } from '@/types';
import { Message } from '@/features/chat/messages/types';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/features/chat/messages/utils';
import { roomApi } from '../../api';
import { useChatBox } from '../../contexts';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface RoomFilesProps {}

export const RoomFiles = () => {
  const { room } = useChatBox();
  const roomId = room._id;
  const roomStatus = room.status;
  const { t } = useTranslation('common');
  const { items, hasNextPage, fetchNextPage } =
    useCursorPaginationQuery<Message>({
      queryKey: ['files', roomId],
      queryFn: ({ pageParam }) =>
        roomApi.getFiles({
          roomId: roomId,
          params: { cursor: pageParam, limit: 8 },
        }),
      config: {
        enabled: roomStatus !== 'temporary',
      },
    });

  const files = useMemo<Media[]>(() => {
    const files: Media[] = [];
    items.forEach((message) => {
      if (message.type === 'media') {
        files.push(...(message.media || []));
      }
    });
    return files;
  }, [items]);
  return (
    <>
      <div className=" my-2  w-full space-y-1">
        {files.map((file) => (
          <a
            key={file.url}
            download
            target="_blank"
            href={file.url}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg p-2 hover:bg-neutral-50 active:bg-neutral-100  dark:hover:bg-neutral-900 active:bg-neutral-800',
            )}
          >
            <div className="rounded-full bg-lighter p-2">
              <File className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span
                className="line-clamp-1 text-base font-semibold"
                title={file.name}
              >
                {file.name}
              </span>
              <span className={cn('text-xs')}>
                {formatFileSize(file.size!)}
              </span>
            </div>
          </a>
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
          <span className="text-primary-500-main">{t('COMMON.SHOW_MORE')}</span>
        </Button>
      )}
    </>
  );
};
