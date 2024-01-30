'use client';
import { PropsWithChildren } from 'react';
import { useMediaUpload } from '.';
import { cn } from '@/utils/cn';
import { FilePlus2Icon } from 'lucide-react';

export const MediaUploadDropzone = ({
  children,
  className,
}: PropsWithChildren & {
  className?: string;
}) => {
  const { files, getRootProps, isDragActive, getInputProps } = useMediaUpload();
  console.log('files', files);
  return (
    <div
      {...getRootProps()}
      className={cn('relative flex flex-1 flex-col overflow-hidden', className)}
    >
      {children}
      {isDragActive && (
        <div className="absolute inset-0 bottom-0 left-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-lg">
          <FilePlus2Icon className="mb-4 size-32 text-primary" />
          <span>Drop files here to upload</span>
        </div>
      )}
      <input type="file" className="hidden" {...getInputProps()} />
    </div>
  );
};
