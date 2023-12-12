import { FileOutline } from '@easy-eva-icons/react';
import { Media } from '@/types';
import { cn } from '@/utils/cn';
import { formatFileSize } from '../../utils';

export interface DocumentProps {
  file: Media;
  isMe: boolean;
}

export const DocumentMessage = ({ file, isMe }: DocumentProps) => {
  return (
    <a
      download
      target="_blank"
      href={file.url}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-lg p-2 px-3',
        isMe ? 'bg-primary' : 'bg-background-darker',
      )}
    >
      <div className="rounded-full bg-lighter p-2">
        <FileOutline className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col">
        <span
          title={file.name}
          className={cn('font-semibold', isMe && 'text-background')}
        >
          {file.name}
        </span>
        <span className={cn('text-xs', isMe ? 'text-background' : 'text-text')}>
          {formatFileSize(file.size!)}
        </span>
      </div>
    </a>
  );
};
