'use client';

import { cn } from '@/utils/cn';
import { motion, useDragControls } from 'framer-motion';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useVideoCallStore } from '../store/video-call.store';

interface CallDragableProps {
  className?: string;
}
const CallDragable = ({ children, className }: PropsWithChildren & CallDragableProps) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  useEffect(() => {
    if(isFullScreen) {
      setTimeout(() => {
        dragContainerRef.current?.removeAttribute('style');
      }, 1);
    }
  }, [isFullScreen]);
  return (
    <motion.div
      ref={constraintsRef}
      className="pointer-events-none fixed inset-0 z-50 block max-h-vh cursor-auto bg-transparent h-full"
    >
      <motion.div
        drag
        {...(isFullScreen ? {} : { dragConstraints: constraintsRef }) }
        dragControls={controls}
        dragMomentum={false}
        ref={dragContainerRef}
        className={cn("pointer-events-auto absolute h-full cursor-auto shadow-glow md:bottom-4 md:left-4 w-[304px] rounded-xl", className)}
        onDoubleClick={() => {
          dragContainerRef.current?.removeAttribute('style');
        }}
      >
        <div className={cn("flex max-h-vh w-full flex-col overflow-hidden bg-primary-100 rounded-xl md:rounded-none", isFullScreen ? 'h-full' : 'md:rounded-xl border border-primary-400 h-fit')}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CallDragable;
