import ParticipantInVideoCall from '@/features/call/interfaces/participant';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { Fragment, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import DoodleItem from '../doodle/doodle-item';
import VideoItem from '../video/video-item';
import { cn } from '@/utils/cn';
import WaitingItem from '../video/waiting-item';

const GalleryLayout = () => {
  
  const participants = useParticipantVideoCallStore(state => state.participants);
  const isDoodle = useVideoCallStore(state => state.isDoodle);
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  
  const classes = useMemo(() => {
    if (!isFullScreen) return 'grid-cols-4';
    const numberItem = participants.length + (isDoodle ? 1 : 0);
    switch (numberItem) {
      case 1:
        return 'grid-cols-1 grid-rows-1';
      case 2:
        return 'grid-cols-2 grid-rows-1';
      case 3:
        return 'grid-cols-2 grid-rows-2 md:grid-cols-3 md:grid-rows-1';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      case 5:
      case 6:
        return 'grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2';
      case 7:
      case 8:
      case 9:
        return 'grid-cols-2 md:grid-cols-3 md:grid-rows-3';
      default:
        return 'grid-cols-2 md:grid-cols-3';
    }
  }, [isDoodle, isFullScreen, participants.length]);

  if(participants.length === 0) return <Fragment></Fragment>
  // console.log('🔴GalleryLayout')
  return (
    <div className="h-full w-full overflow-auto md:overflow-hidden">
      <div
        className={`grid w-full min-h-full md:h-full content-center items-center justify-center p-2 ${classes}`}
      >
        {isDoodle && <DoodleItem />}
        {participants.map(
          (participant: ParticipantInVideoCall, index: number) => (
            <div
              key={index}
              className={twMerge(
                'h-full w-full',
                isFullScreen && 'min-h-[200px] md:min-h-max',
              )}
            >
              <VideoItem isGalleryView participant={participant} />
            </div>
          ),
        )}

        <WaitingItem />
        
      </div>
    </div>
  );
};

export default GalleryLayout;
