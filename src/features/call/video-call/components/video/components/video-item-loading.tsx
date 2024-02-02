import { Spinner } from '@/components/feedback';
import React from 'react';

interface VideoItemLoadingProps {
  isLoading: boolean;
  isMe?: boolean;
  isShareScreen?: boolean;
}

export default function VideoItemLoading({
  isLoading,
  isMe,
  isShareScreen,
}: VideoItemLoadingProps) {
  return (
    <>
      {isLoading && isMe && !isShareScreen && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-800">
          <Spinner className="text-white"></Spinner>
        </div>
      )}
    </>
  );
}
