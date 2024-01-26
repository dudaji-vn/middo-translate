'use client';

import { Button } from '@/components/actions';
import { motion, useDragControls } from 'framer-motion';
import { Maximize2, Minimize2, Phone } from 'lucide-react';
import { useRef } from 'react';
import { useVideoCallStore } from '../store/video-call.store';
import VideoCallPage from './video-call-main';

const VideoCallDragWrapper = () => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  const { room, isFullScreen, setFullScreen } = useVideoCallStore();

  const toggleFullScreen = () => {
    setFullScreen(!isFullScreen);
  };

  return (
    <motion.div
      ref={constraintsRef}
      className={`pointer-events-none fixed inset-0 z-50 max-h-dvh cursor-auto bg-transparent ${
        room?._id ? 'block' : 'hidden'
      }`}
    >
      <motion.div
        drag
        dragListener={!isFullScreen}
        dragConstraints={constraintsRef}
        dragControls={controls}
        dragMomentum={false}
        className={`pointer-events-auto absolute cursor-auto ${
          isFullScreen
            ? 'h-full w-full !translate-x-0 !translate-y-0'
            : 'shadow-primary/500 bottom-4 left-4 w-[336px] rounded-xl border border-primary-400 shadow-lg'
        }`}
      >
        <div className=" shadow-primary-500/30 flex h-full max-h-dvh w-full flex-col overflow-hidden rounded-xl bg-white shadow-2">
          <div
            className={`flex items-center gap-1 bg-primary-100 py-2 pl-3 pr-1 text-primary ${
              !isFullScreen && 'cursor-grab active:cursor-grabbing'
            }`}
          >
            <Phone className="h-4 w-4 stroke-current" />
            <span className="line-clamp-1 flex-1 font-semibold">
              {room?.name}
            </span>
            <Button.Icon
              variant="default"
              color="default"
              size="xs"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? <Minimize2 /> : <Maximize2 />}
            </Button.Icon>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <VideoCallPage></VideoCallPage>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoCallDragWrapper;
