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

  const numberItem = useMemo(() => participants.length + (isDoodle ? 1 : 0), [isDoodle, participants.length]);
  const classes = useMemo(() => {
    if (!isFullScreen) return 'grid-cols-4';
    const numberItem = participants.length + (isDoodle ? 1 : 0);
    switch (numberItem) {
      case 1:
        return 'grid-cols-1 grid-rows-1';
      case 2:
        return 'md:grid-cols-2 md:grid-rows-1 grid-cols-1 grid-rows-2';
      case 3:
        return 'grid-cols-2 grid-rows-2 md:grid-cols-2 md:grid-rows-2';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      case 5:
        return 'grid-cols-2 grid-rows-2 md:grid-cols-3 md:grid-rows-2';
      case 6:
        return 'grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2';
      case 7:
        return 'grid-cols-2 grid-rows-4 md:grid-cols-4 md:grid-rows-2';
      case 8:
        return 'grid-cols-2 grid-rows-4 md:grid-cols-4 md:grid-rows-2';
      case 9:
        return 'grid-cols-2 md:grid-cols-3 md:grid-rows-3';
      case 10:
      case 11:
      case 12:
        return 'grid-cols-2 md:grid-cols-4 md:grid-rows-3';
      default:
        let numRow = Math.ceil(numberItem / 4);
        console.log('numRow', numRow);
        return `grid-cols-2 md:grid-cols-4 md:grid-rows-${numRow}`;
    }
  }, [isDoodle, isFullScreen, participants.length]);

  // const [indexColSpan, valColSpan] = useMemo(() => {
  //   if (!isFullScreen) return [Number.POSITIVE_INFINITY, 0];
  //   const numberItem = participants.length + (isDoodle ? 1 : 0);
  //   switch (numberItem) {
  //     case 1:
  //     case 2:
  //       return [Number.POSITIVE_INFINITY, 0];
  //     case 3:
  //       return [isDoodle ? Number.POSITIVE_INFINITY : 1, 2];
  //     default:
  //       return [4, 1];
  //   }
  
  // }, [isDoodle, isFullScreen, participants.length]);

  if(participants.length === 0) return <Fragment></Fragment>
  // console.log('🔴GalleryLayout')
  return (
    <div className="h-full w-full overflow-auto md:overflow-hidden">
      <div
        className={`grid w-full min-h-full md:h-full content-center items-center justify-center p-2 ${classes}`}
      >
        {isDoodle && <DoodleItem />}
        {participants.map(
          (participant: ParticipantInVideoCall, index: number) => {
            if(!isFullScreen && index == (isDoodle ? 6 : 7) && numberItem > (isDoodle ? 7 : 8)) {
              const remain = numberItem - (isDoodle ? 6 : 7);
              return <div  key={index} className='h-full w-full relative'>
                <VideoItem isGalleryView participant={participant} />
                <ItemNumber numberItem={remain} />
              </div>
            }
            if(!isFullScreen && index > (isDoodle ? 6 : 7) && numberItem > (isDoodle ? 7 : 8)) return <></>

            // let extraClass = '';
            // if(index > indexColSpan && valColSpan > 0) {
            //   extraClass = `col-span-${valColSpan}`;
            // }
            // console.log('extraClass', extraClass);
            return ( <div
              key={index}
              className={twMerge(
                'h-full w-full',
                isFullScreen && 'min-h-[200px] md:min-h-max',
                // isFullScreen && extraClass,
              )}
            >
              <VideoItem isGalleryView participant={participant} />
            </div>
          )},
        )}

        <WaitingItem />
        
      </div>
    </div>
  );
};

const ItemNumber = ({ numberItem }: { numberItem: number }) => {
  const setFullScreen = useVideoCallStore(state => state.setFullScreen);
  return <div className="h-full w-full absolute inset-0 px-2 py-[2px] cursor-pointer z-10" onClick={() => setFullScreen(true)}>
      <p className='relative flex h-full w-full items-center justify-center rounded-2xl bg-black/60 font-medium text-white'>
        {numberItem - 1}+
      </p>
    </div>
};

export default GalleryLayout;
