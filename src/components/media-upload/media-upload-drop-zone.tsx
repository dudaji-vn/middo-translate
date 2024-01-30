'use client';
import { PropsWithChildren } from 'react';
import { useMediaUpload } from '.';
import { cn } from '@/utils/cn';

export const MediaUploadDropzone = ({
  children,
  className,
}: PropsWithChildren & {
  className?: string;
}) => {
  const { files, getRootProps, isDragActive } = useMediaUpload();
  console.log('files', files);
  return (
    <div
      {...getRootProps()}
      className={cn('relative flex flex-1 flex-col overflow-hidden', className)}
    >
      {children}
      {isDragActive && (
        <div className="absolute inset-0 bottom-0 left-0 z-10 backdrop-blur-sm" />
      )}
    </div>
  );
};
