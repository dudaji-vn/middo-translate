import { Fullscreen } from 'lucide-react';
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
          className="h-full object-contain w-full"
          alt="Doodle Image"
        />
        <div
          className={cn(
            'absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/80 text-white opacity-0 transition-all',
            layout !== VIDEOCALL_LAYOUTS.FOCUS_VIEW &&
              isFullScreen &&
              'hover:opacity-100',
          )}
          onClick={expandDoodle}
        >
          <Fullscreen className="h-6 w-6" />
          {isFullScreen && layout !== VIDEOCALL_LAYOUTS.FOCUS_VIEW && (
            <p className="text-center">Click to expand</p>
          )}
        </div>
        {!isPinDoodle && <div className="pointer-events-none absolute bottom-1 w-full px-1">
          <div className="pointer-events-none w-fit max-w-full cursor-none rounded-full  bg-black/80 px-2  py-1">
            <p className="truncate px-1 text-sm leading-snug text-white">
              Doodle
            </p>
          </div>
        </div>}
        <div
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/90 opacity-0',
            isPinDoodle &&
              isFullScreen &&
              layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW &&
              'opacity-100',
          )}
        >
          <p className="truncate text-sm leading-snug text-white">Doodle</p>
        </div>
      </div>
    </section>
  );
};
export default DoodleItem;
