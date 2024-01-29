import { Fullscreen } from 'lucide-react';
import { memo, useRef } from 'react';

import { Avatar } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { twMerge } from 'tailwind-merge';
import { VIDEOCALL_LAYOUTS } from '../../constant/layout';
import useAudioLevel from '../../hooks/use-audio-level';
import useLoadStream from '../../hooks/use-load-stream';
import { useParticipantVideoCallStore } from '../../store/participant.store';
import { useVideoCallStore } from '../../store/video-call.store';
import trimLongName from '../../utils/trim-long-name.util';

interface VideoItemProps {
  participant?: any;
  size?: 'sm' | 'md' | 'lg';
  isGalleryView?: boolean;
}
const VideoItem = ({ participant, isGalleryView }: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const itemRef = useRef<HTMLElement>(null);
  const { streamVideo, isTurnOnMic, isTurnOnCamera } = useLoadStream(
    participant,
    videoRef,
  );
  const { isTalk } = useAudioLevel(streamVideo);
  const { pinParticipant } = useParticipantVideoCallStore();
  const { setLayout, layout } = useVideoCallStore();
  const { pin: isPin } = participant;
  // useCalcLayoutItem(itemRef, participants?.length);
  const { isFullScreen, setFullScreen, setPinShareScreen, setPinDoodle } =
    useVideoCallStore();

  const expandVideoItem = () => {
    if (!isFullScreen) setFullScreen(true);
    setLayout(VIDEOCALL_LAYOUTS.FOCUS_VIEW);
    if (participant.isShareScreen) setPinShareScreen(true);
    setPinDoodle(false);
    pinParticipant(participant.socketId, participant.isShareScreen);
  };
  return (
    <section
      ref={itemRef}
      className="flex h-full w-full items-center justify-center p-[2px]"
    >
      <div
        className={twMerge(
          'relative flex h-full w-full items-center justify-center   overflow-hidden rounded-xl bg-neutral-50 transition-all',
          // !isTurnOnCamera && !isFullScreen && 'aspect-square h-[60px] w-[60px]',
          isTurnOnCamera && !isGalleryView && 'w-[100px]',
          !isFullScreen && 'aspect-square h-[60px] w-[60px]',
          !isFullScreen && isGalleryView && isTurnOnCamera && 'w-[100px]',
          isGalleryView && isFullScreen && 'min-h-[200px]',
        )}
      >
        <div
          className={twMerge(
            'absolute inset-0 rounded-xl border-4 border-primary transition-all z-10 pointer-events-none',
            isTalk ? 'opacity-100' : 'opacity-0',
          )}
        ></div>
        <div
          className={twMerge(
            'absolute left-1/2 top-1/2 flex max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center',
            isTurnOnCamera ? 'pointer-events-none hidden cursor-none' : '',
          )}
        >
          <div
            className={cn(
              'aspect-square w-9 max-w-[90%] ',
              isFullScreen && isGalleryView && 'md:w-[64px]',
            )}
          >
            <Avatar
              className="h-full w-full bg-neutral-900 object-cover"
              src={participant?.user?.avatar || '/person.svg'}
              alt={participant?.user?.name || 'Anonymous'}
            />
          </div>
          {layout === VIDEOCALL_LAYOUTS.GALLERY_VIEW && isFullScreen && (
            <span className="relative mt-2 block text-center leading-none">
              {trimLongName(participant?.user?.name) || ''}
            </span>
          )}
        </div>
        <video
          ref={videoRef}
          className={`h-full w-full flex-1 rounded-xl object-cover ${
            isTurnOnCamera ? 'block' : 'hidden'
          }`}
          playsInline
          controls={false}
        ></video>
        <div
          className={cn(
            'absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/80 text-white opacity-0 transition-all',
            isGalleryView && isFullScreen && 'hover:opacity-100',
          )}
          onClick={expandVideoItem}
        >
          {isGalleryView && isFullScreen && <Fullscreen className="h-4 w-4" />}
          {isFullScreen && layout !== VIDEOCALL_LAYOUTS.FOCUS_VIEW && (
            <p className="text-center">Click to expand</p>
          )}
        </div>

        {!isPin && <div className="pointer-events-none absolute bottom-1 w-full px-1">
          <div className="pointer-events-none w-fit max-w-full cursor-none rounded-full  bg-black/80 px-2  py-1">
            <p className="truncate text-sm leading-none text-white">
              {participant.isMe
                ? 'You'
                : trimLongName(participant?.user?.name) || ''}
              {participant?.isShareScreen ? '  (Screen)' : ''}
            </p>
          </div>
        </div>}
        <div 
        className={cn("absolute top-0 left-0 bottom-0 right-0 bg-black/80 flex items-center justify-center opacity-0 pointer-events-none", isPin && isFullScreen && layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW && 'opacity-100')}>
            <p className="truncate text-sm leading-none text-white">
              {participant.isMe
                ? 'You'
                : trimLongName(participant?.user?.name, 3) || ''}
              {participant?.isShareScreen ? '  (Screen)' : ''}
            </p>
        </div>
      </div>
    </section>
  );
};
export default memo(VideoItem);
