import { Fullscreen } from 'lucide-react';
import { useParticipantVideoCallStore } from '../../store/participant.store';
import { useVideoCallStore } from '../../store/video-call.store';
import { VIDEOCALL_LAYOUTS } from '../../constant/layout';
import Image from 'next/image';
import { cn } from '@/utils/cn';
interface DoodleItemProps {}
const DoodleItem = ({}: DoodleItemProps) => {
  const { doodleImage } = useVideoCallStore();
  const {
    isFullScreen,
    setFullScreen,
    layout,
    setPinDoodle,
    setLayout,
    isPinDoodle,
  } = useVideoCallStore();
  const expandDoodle = () => {
    if (!isFullScreen) setFullScreen(true);
    setLayout(VIDEOCALL_LAYOUTS.FOCUS_VIEW);
    setPinDoodle(true);
  };

  return (
    <section className="relative flex h-full items-center justify-center overflow-hidden p-[2px]">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-50  ">
        <Image
          src={doodleImage || ''}
          width={1000}
          height={1000}
          className="h-full object-contain"
          alt="Doodle Image"
        />
        <div
          className={cn("absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/80 text-white opacity-100 transition-all md:opacity-0",
          layout !== VIDEOCALL_LAYOUTS.FOCUS_VIEW && isFullScreen && 'hover:opacity-100',)}
          onClick={expandDoodle}
        >
          <Fullscreen className="h-6 w-6" />
          {isFullScreen && layout !== VIDEOCALL_LAYOUTS.FOCUS_VIEW && (
            <p className="text-center">Click to expand</p>
          )}
        </div>
        <p className="pointer-events-none absolute bottom-1 left-1 cursor-none text-sm leading-none text-white">
          Doodle
        </p>
        <div
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/80 opacity-0',
            isPinDoodle &&
              isFullScreen &&
              layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW &&
              'opacity-100',
          )}
        >
          <p className="truncate text-sm leading-none text-white">Doodle</p>
        </div>
      </div>
    </section>
  );
};
export default DoodleItem;
