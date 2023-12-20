import { FileIcon, defaultStyles } from 'react-file-icon';

import { Media } from '@/types';
import { cn } from '@/utils/cn';
import { formatFileSize } from '../../utils';

export interface DocumentProps {
  file: Media;
  isMe: boolean;
}

export const DocumentMessage = ({ file, isMe }: DocumentProps) => {
  const extension = file.name?.split('.').pop();
  return (
    <a
      download
      target="_blank"
      href={file.url}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2',
        isMe ? 'bg-primary' : 'bg-background-darker',
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
      <div className="flex flex-col">
        <span
          title={file.name}
          className={cn('text-sm font-semibold', isMe && 'text-background')}
        >
          {file.name}
        </span>
        <span
          className={cn('mt-1 text-xs', isMe ? 'text-background' : 'text-text')}
        >
          {formatFileSize(file.size!)}
        </span>
      </div>
    </a>
  );
};
