'use client';

import { cn } from '@/utils/cn';
import { motion, useDragControls } from 'framer-motion';
import { PropsWithChildren, useRef } from 'react';
import { useVideoCallStore } from '../store/video-call.store';

interface CallDragableProps {
  className?: string;
}
const CallDragable = ({ children, className }: PropsWithChildren & CallDragableProps) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  return (
    <motion.div
      ref={constraintsRef}
      className="pointer-events-none fixed inset-0 z-50 block max-h-vh cursor-auto bg-transparent h-full"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragControls={controls}
        dragMomentum={false}
        className={cn("pointer-events-auto absolute h-full cursor-auto shadow-glow md:bottom-4 md:left-4 w-[336px] rounded-xl", className)}
      >
        <div className={cn("flex max-h-vh w-full flex-col overflow-hidden bg-primary-100 rounded-xl md:rounded-none", isFullScreen ? 'h-full' : 'md:rounded-xl border border-primary-400 h-fit')}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CallDragable;
