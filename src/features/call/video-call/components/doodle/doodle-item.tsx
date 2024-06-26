import { Fullscreen } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { VIDEO_CALL_LAYOUTS } from '@/features/call/constant/layout';
import { useTranslation } from 'react-i18next';
interface DoodleItemProps {}
const DoodleItem = ({}: DoodleItemProps) => {
  const {t} = useTranslation('common')
  
  const doodleImage = useVideoCallStore(state => state.doodleImage);
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const setFullScreen = useVideoCallStore(state => state.setFullScreen);
  const layout = useVideoCallStore(state => state.layout);
  const setPinDoodle = useVideoCallStore(state => state.setPinDoodle);
  const setLayout = useVideoCallStore(state => state.setLayout);
  const isPinDoodle = useVideoCallStore(state => state.isPinDoodle);

  const expandDoodle = () => {
    if (!isFullScreen) setFullScreen(true);
    setLayout(VIDEO_CALL_LAYOUTS.FOCUS_VIEW);
    setPinDoodle(true);
  };

  return (
    <section className="relative flex h-full items-center justify-center overflow-hidden p-[2px]">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900  ">
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
            layout !== VIDEO_CALL_LAYOUTS.FOCUS_VIEW &&
              isFullScreen &&
              'hover:opacity-100',
          )}
          onClick={expandDoodle}
        >
          <Fullscreen className="h-6 w-6" />
          {isFullScreen && layout !== VIDEO_CALL_LAYOUTS.FOCUS_VIEW && (
            <p className="text-center"> {t('CONVERSATION.EXPAND')}</p>
          )}
        </div>
        {!isPinDoodle && <div className="pointer-events-none absolute bottom-1 w-full px-1">
          <div className="pointer-events-none w-fit max-w-full cursor-none rounded-full  bg-black/80 px-2  py-1">
            <p className="truncate px-1 text-sm leading-snug text-white">
              {t('CONVERSATION.DOODLE')}
            </p>
          </div>
        </div>}
        <div
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/90 opacity-0',
            isPinDoodle &&
              isFullScreen &&
              layout == VIDEO_CALL_LAYOUTS.FOCUS_VIEW &&
              'opacity-100',
          )}
        >
          <p className="truncate text-sm leading-snug text-white">{t('CONVERSATION.DOODLE')}</p>
        </div>
      </div>
    </section>
  );
};
export default DoodleItem;
