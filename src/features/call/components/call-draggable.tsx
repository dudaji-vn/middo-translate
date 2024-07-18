'use client';

import { cn } from '@/utils/cn';
import { motion, useAnimationControls, useDragControls } from 'framer-motion';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { useVideoCallStore } from '../store/video-call.store';
import useHelpDesk from '../hooks/use-help-desk';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

interface CallDragableProps {
  className?: string;
}
const CallDraggable = ({ children, className }: PropsWithChildren & CallDragableProps) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  const animationControls = useAnimationControls();
  const { isHelpDeskCall } = useHelpDesk();
  const {isBusiness} = useBusinessNavigationData();
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  // const isAllowDrag = useVideoCallStore(state => state.isAllowDrag);
  useEffect(() => {
    animationControls.set({
      x:0,
      y:0
    })
  }, [animationControls, isFullScreen]);
  
  const isAllowDragCall = useMemo(()=>{
    if(isHelpDeskCall && !isBusiness) return false
    return !isFullScreen;
  }, [isBusiness, isHelpDeskCall, isFullScreen]) 
  return (
    <motion.div
      ref={constraintsRef}
      className={cn("pointer-events-none fixed inset-0 z-50 block max-h-vh cursor-auto bg-transparent h-full")}
    >
      <motion.div
        drag
        {...(isFullScreen ? {} : { dragConstraints: constraintsRef }) }
        dragControls={controls}
        dragMomentum={false}
        animate={animationControls}
        ref={dragContainerRef}
        dragListener={isAllowDragCall}
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

export default CallDraggable;
