import { Fullscreen } from 'lucide-react';
import { useParticipantVideoCallStore } from '../../store/participant.store';
import { useVideoCallStore } from '../../store/video-call.store';
import { VIDEOCALL_LAYOUTS } from '../../constant/layout';
import Image from 'next/image';
interface DoodleItemProps {
}
const DoodleItem = ({  }: DoodleItemProps) => {
  const { participants, pinParticipant } = useParticipantVideoCallStore();
  const { doodleImage } = useVideoCallStore();
  const { isFullScreen, setFullScreen, layout, setPinDoodle, setLayout } = useVideoCallStore();
  const expandDoodle = () => {
    if(!isFullScreen) setFullScreen(true);
    setLayout(VIDEOCALL_LAYOUTS.FOCUS_VIEW)
    setPinDoodle(true)
  }
  
  return ( <section className='p-[2px] h-full flex items-center justify-center'>
        <div className='w-full h-full flex items-center justify-center bg-neutral-50 relative rounded-xl overflow-hidden  '>
            <Image
                src={doodleImage || ''}
                width={1000}
                height={1000}
                className='h-full object-contain'
                alt="Doodle Image"
            />
            <div className='cursor-pointer md:opacity-0 opacity-100 transition-all hover:opacity-100 absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white gap-1' onClick={expandDoodle}>
            <Fullscreen className='w-6 h-6' />
            {isFullScreen && layout !== VIDEOCALL_LAYOUTS.FOCUS_VIEW && <p className='text-center'>Click to expand</p>}
            </div>
            <p className='leading-none absolute bottom-1 left-1 text-white text-sm cursor-none pointer-events-none'>
                Doodle
            </p>
        </div>
    </section>

  );
};
export default DoodleItem;
