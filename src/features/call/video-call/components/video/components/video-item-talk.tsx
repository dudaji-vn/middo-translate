
import useAudioLevel from '@/features/call/hooks/use-audio-level';
import { cn } from '@/utils/cn';
import React, { memo } from 'react';
interface VideoItemTalkProps {
  stream?: MediaStream;
}
const VideoItemTalk = ({ stream }: VideoItemTalkProps) => {
    const { isTalk } = useAudioLevel(stream);
    return (
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-10 rounded-xl border-4 border-primary transition-all',
          isTalk ? 'opacity-100' : 'opacity-0',
        )}
      ></div>
    )
}

export default memo(VideoItemTalk)
