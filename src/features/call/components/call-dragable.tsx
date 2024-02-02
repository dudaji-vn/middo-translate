'use client';

import { motion, useDragControls } from 'framer-motion';
import { PropsWithChildren, useRef } from 'react';

const CallDragable = ({ children }: PropsWithChildren) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  return (
    <motion.div
      ref={constraintsRef}
      className="pointer-events-none fixed inset-0 z-[51] block max-h-dvh cursor-auto bg-transparent"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragControls={controls}
        dragMomentum={false}
        className="pointer-events-auto absolute h-full w-full cursor-auto shadow-glow  md:bottom-4 md:left-4 md:h-[252px] md:w-[336px] md:rounded-xl"
      >
        <div className="flex h-full max-h-dvh w-full flex-col overflow-hidden bg-primary-100 md:rounded-xl md:border md:border-primary-400">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CallDragable;
