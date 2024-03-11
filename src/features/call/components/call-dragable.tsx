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
  const {isFullScreen } = useVideoCallStore();
  return (
    <motion.div
      ref={constraintsRef}
      className="pointer-events-none fixed inset-0 z-50 block max-h-vh cursor-auto bg-transparent"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragControls={controls}
        dragMomentum={false}
        className={cn("pointer-events-auto absolute h-full w-full cursor-auto shadow-glow md:bottom-4 md:left-4 md:w-[336px] md:rounded-xl", className)}
      >
        <div className={cn("flex h-full max-h-vh w-full flex-col overflow-hidden bg-primary-100", isFullScreen ? '' : 'rounded-xl border border-primary-400')}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CallDragable;
