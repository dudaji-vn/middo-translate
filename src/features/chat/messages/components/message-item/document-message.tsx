import { FileOutline } from '@easy-eva-icons/react';
import { Media } from '@/types';
import { formatFileSize } from '../../utils';

export interface DocumentProps {
  file: Media;
}

export const DocumentMessage = ({ file }: DocumentProps) => {
  return (
    <a
      download
      href={file.url}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-2 px-3"
    >
      <div className="rounded-full bg-lighter p-2">
        <FileOutline className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col">
        <span title={file.name} className="font-semibold text-background">
          {file.name}
        </span>
        <span className="text-sm font-light text-background">
          {formatFileSize(file.size!)}
        </span>
      </div>
    </a>
  );
};
