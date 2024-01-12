import { Fullscreen, Mic, MicOff, VideoIcon, VideoOff } from 'lucide-react';
import { memo, useEffect, useMemo, useRef } from 'react';

import { Avatar } from '@/components/data-display';
import trimLongName from '../../utils/trim-long-name.util';
import { twMerge } from 'tailwind-merge';
import useAudioLevel from '../../hooks/use-audio-level';
import useLoadStream from '../../hooks/use-load-stream';
import { useMyVideoCallStore } from '../../store/me.store';
import useCalcLayoutItem from '../../hooks/use-calc-layout-item';
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
  
  return ( <section className='p-[2px] h-full flex items-center justify-center max-h-[300px] rounded-xl overflow-hidden relative bg-neutral-50'>
        <div className='w-full h-full flex items-center justify-center'>
            <Image
                src={doodleImage || ''}
                width={300}
                height={300}
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
