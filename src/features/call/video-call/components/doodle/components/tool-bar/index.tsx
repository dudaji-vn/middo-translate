import React, { memo, useRef, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Brush, ChevronDown, ChevronUp, Eraser, GripHorizontal, RotateCcw, Undo2, X } from 'lucide-react';
import { Button } from '@/components/actions';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useDoodleContext } from '../../context/doodle-context-context';
import ParticipantDoodleList from './participants-doodle-list';
interface ToolbarProps {
  toggleDrawing: () => void;
  toggleEraser: () => void;
  handleUndo: () => void;
  handleStopDoodle: () => void;
  isEraser: boolean;
  isShowStop?: boolean;
}

const Toolbar = (props: ToolbarProps) => {
  const {
    toggleDrawing,
    toggleEraser,
    handleUndo,
    handleStopDoodle,
    isEraser,
    isShowStop = true,
  } = props;

  const constraintsRef = useRef(null);
  const controls = useDragControls();
  const [isShowColor, setShowColor] = useState(false);

  const isDrawing = useVideoCallStore(state => state.isDrawing);
  const  isMeDoodle = useVideoCallStore(state => state.isMeDoodle);

  const {setShowConfirmClear} = useDoodleContext();
  return (
    <motion.section
      ref={constraintsRef}
      className="pointer-events-none absolute inset-0"
    >
      <motion.div
        drag
        dragListener={true}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        whileTap={{ boxShadow: '0px 0px 15px rgba(0,0,0,0.2)' }}
        dragControls={controls}
        className="pointer-events-auto absolute left-2 top-2 z-20 flex flex-col items-center gap-3 rounded-md bg-white dark:bg-neutral-800 border border-neutral-800 p-2"
      >
        <div onPointerDown={(e) => controls.start(e)} className="cursor-move">
          <GripHorizontal></GripHorizontal>
        </div>
        <Button.Icon
          variant="default"
          size="xs"
          color={isDrawing ? 'primary' : 'default'}
          onClick={toggleDrawing}
        >
          <Brush />
        </Button.Icon>
        <Button.Icon
          variant="default"
          size="xs"
          color={isEraser ? 'primary' : 'default'}
          onClick={toggleEraser}
        >
          <Eraser />
        </Button.Icon>
        <Button.Icon
          variant="default"
          size="xs"
          color="default"
          onClick={handleUndo}
        >
          <Undo2 />
        </Button.Icon>
        <Button.Icon
          variant="default"
          size="xs"
          color="default"
          onClick={() => setShowConfirmClear(true)}
        >
          <RotateCcw />
        </Button.Icon>
        {isMeDoodle && (
          <Button.Icon
            variant="default"
            size="xs"
            color="error"
            onClick={handleStopDoodle}
          >
            <X />
          </Button.Icon>
        )}
        <div className="flex flex-col items-center">
          {isShowColor && <ParticipantDoodleList />}
          <div className="border-t border-neutral-50 dark:border-neutral-700">
            <Button.Icon
              variant="ghost"
              size="xs"
              color="default"
              onClick={() => setShowColor(!isShowColor)}
            >
              {isShowColor ? <ChevronUp /> : <ChevronDown />}
            </Button.Icon>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default memo(Toolbar);
