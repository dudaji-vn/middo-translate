import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { ModalConfirmClearDoodle } from '@/features/call/video-call/components/doodle/components/modal-confirm-clear-doodle';
import ImageParticipants from './components/image-participants';
import Drawling from './components/drawling';
import { cn } from '@/utils/cn';
import { DoodleProvider } from './context/doodle-context-context';
import useFitSizeImage from './hooks/use-fit-size-image';
import ToolBar from './components/tool-bar';


export const DoodleArea = () => {
    const { doodleImage, setConfirmStopDoodle, colorDoodle, isMeDoole } = useVideoCallStore();
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const { isDrawing, setDrawing } = useVideoCallStore();
    const [isEraser, setIsEraser] = useState(false);
    const {width, height} = useFitSizeImage({imageRef, canvasRef});

    const toggleDrawing = () => {
        if(!isDrawing) setIsEraser(false)
        setDrawing(!isDrawing);
        canvasRef.current?.eraseMode(false);
    }
    const toggleEraser = () => {
        if(isEraser) {
            setIsEraser(false);
            setDrawing(true);
            canvasRef.current?.eraseMode(false);
        } else {
            setIsEraser(true);
            setDrawing(false);
            canvasRef.current?.eraseMode(true);
        }
    }
    const handleUndo = async () => {
        canvasRef.current?.undo();
    }
    const handleReset = () => {
        canvasRef.current?.resetCanvas();
    }
    const handleStopDoodle = () => {
        setConfirmStopDoodle(true)
    }
    
    useEffect(() => {
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA)
    }, [])

    return (
        <DoodleProvider>
            <div className='rounded-xl overflow-hidden relative transition-all w-full h-full  bg-neutral-900'>
                <Image src={doodleImage || ''} width={500} height={500} alt="Doodle" ref={imageRef} className='object-contain w-full h-full' />
                <Drawling
                    ref={canvasRef} 
                    color={colorDoodle}
                    width={width} 
                    height={height}
                    className={cn('absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-10 bg-transparent', isDrawing ? 'cursor-drawing' : '', isEraser ? 'cursor-eraser' : '',
                    !isDrawing && !isEraser && 'cursor-auto pointer-events-none')}
                />
                <ImageParticipants width={width} height={height} />
                <ToolBar
                    toggleDrawing={toggleDrawing}
                    toggleEraser={toggleEraser}
                    handleUndo={handleUndo}
                    handleStopDoodle={handleStopDoodle}
                    isEraser={isEraser}
                />
                <ModalConfirmClearDoodle handleSubmit={handleReset}/>
            </div>
        </DoodleProvider>
    );
};
