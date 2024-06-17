import { FileIcon, defaultStyles } from 'react-file-icon';

import { Media } from '@/types';
import { cn } from '@/utils/cn';
import { formatFileSize } from '../../utils';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';

export interface DocumentProps {
  file: Media;
  isMe?: boolean;
}

export const DocumentMessage = ({ file, isMe = false }: DocumentProps) => {
  const extension = file.name?.split('.').pop();
  const { postMessage, isMobile } = useReactNativePostMessage();
  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
        if (!isMobile) return;
        e.preventDefault();
        postMessage({
          type: 'Trigger',
          data: {
            event: 'link',
            payload: {
              url: file.url,
            },
          },
        });
      }}
      download
      target="_blank"
      href={file.url}
      className={cn(
        'flex w-full items-center gap-2 overflow-hidden rounded-lg px-3 py-2',
        isMe ? 'bg-primary' : 'bg-background-darker dark:bg-neutral-900',
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lighter p-2">
        <FileIcon
          extension={extension}
          {...file}
          {...defaultStyles[extension as keyof typeof defaultStyles]}
          radius={8}
        />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span
          title={file.name}
          className={cn(
            'max-w-44 truncate break-all text-sm font-semibold',
            isMe && 'text-background dark:text-neutral-50',
          )}
        >
          {file.name}
        </span>

        <span
          className={cn('mt-1 text-xs', isMe ? 'text-background dark:text-neutral-50' : 'text-text')}
        >
          {formatFileSize(file.size!)}
        </span>
      </div>
    </a>
  );
};
