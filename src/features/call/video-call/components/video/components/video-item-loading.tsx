import { Spinner } from '@/components/feedback';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import React from 'react';

interface VideoItemLoadingProps {
  isMe?: boolean;
  isShareScreen?: boolean;
}

export default function VideoItemLoading({
  isMe,
  isShareScreen,
}: VideoItemLoadingProps) {
  const isLoadingVideo = useMyVideoCallStore(state => state.isLoadingVideo);
  return (
    <>
      {isLoadingVideo && isMe && !isShareScreen && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-800">
          <Spinner className="text-white"></Spinner>
        </div>
      )}
    </>
  );
}
