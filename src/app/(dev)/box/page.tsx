import { MediaUploadProvider } from '@/components/media-upload/media-upload-context';
import * as React from 'react';

export interface IBoxProps {}

export default function Box(props: IBoxProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <MediaUploadProvider></MediaUploadProvider>
    </div>
  );
}
