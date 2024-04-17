import usePlayAudio from '@/features/call/hooks/use-play-audio';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { cn } from '@/utils/cn';
import { memo, useEffect } from 'react';

const WaitingItem = () => {
    const isFullScreen = useVideoCallStore(state => state.isFullScreen);
    const participants = useParticipantVideoCallStore(state => state.participants);
    const isWaitingForSomeoneJoin = useVideoCallStore(state => state.isWaitingForSomeoneJoin);
    const setWaitingForSomeoneJoin = useVideoCallStore(state => state.setWaitingForSomeoneJoin);
    const {playAudio, stopAudio} = usePlayAudio('/mp3/incoming.mp3');

    useEffect(() => {
        if(participants.length > 1) {
            stopAudio();
            setWaitingForSomeoneJoin(false);
        } else if(participants.length === 1 && isWaitingForSomeoneJoin) {
            playAudio();
        }
    }, [isWaitingForSomeoneJoin, participants.length, playAudio, setWaitingForSomeoneJoin, stopAudio])

    // When component unmount => stop audio
    useEffect(() => {
        return () => {
            stopAudio();
        }
    }, [stopAudio])


    if(!isWaitingForSomeoneJoin) {
        stopAudio();
        return null;
    }

  return (
    <div className="h-full w-full px-2 py-[2px]">
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-center rounded-2xl bg-neutral-50',
          isFullScreen && 'min-h-[200px] md:min-h-max',
        )}
      >
        <div className="animate-ping-small absolute left-0 top-0 h-full w-full rounded-2xl border-2 border-primary"></div>
        <div className="inline-flex space-x-[3px]">
          <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.2s]"></div>
          <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.1s]"></div>
          <div className="h-1 w-1 animate-bounce rounded-full bg-neutral-500"></div>
        </div>
      </div>
    </div>
  );
};

export default memo(WaitingItem);
