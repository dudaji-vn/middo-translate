
import { useVideoCallStore } from '../../store';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ButtonDataAction from '@/components/actions/button/button-data-action';
import { Brush, Eraser, GripHorizontal, RotateCcw, Undo2, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { motion, useDragControls } from "framer-motion"
import { CanvasPath, ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';

export const DoodleArea = () => {
    const { doodleImage, setConfirmStopDoodle, colorDoodle } = useVideoCallStore();
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const { isDrawing, setDrawing } = useVideoCallStore();
    const [isEraser, setIsEraser] = useState(false);
    const constraintsRef = useRef(null)
    const controls = useDragControls()
    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0})
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
    const handleUndo = () => {
        canvasRef.current?.undo();
    }
    const handleClear = () => {
        canvasRef.current?.clearCanvas();
    }
    const handleStopDoodle = () => {
        setConfirmStopDoodle(true)
    }
    const handleChangeCanvas = (updatedPaths: CanvasPath[]) => {
        if(updatedPaths.length === 0) return;
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE, updatedPaths)
    }

    useEffect(() => {
        const fillCanvasToImage = () => {
            if(!imageRef.current) return;
            const ratio = imageRef.current.naturalWidth/imageRef.current.naturalHeight
            let width = imageRef.current.height*ratio
            let height = imageRef.current.height
            if(width > window.innerWidth) {
                width = imageRef.current.width
                height = imageRef.current.width/ratio
            }
            setCanvasSize({width, height})
        }
        window.addEventListener('resize', fillCanvasToImage);
        setTimeout(()=>{
            fillCanvasToImage();
        }, 2000)
        return () => {
            window.removeEventListener('resize', fillCanvasToImage);
        }
    }, []);

    useEffect(() => {
        socket.on(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE, async ({path, userId} : {path: CanvasPath[], userId: string}) => {
            if(!canvasRef.current) return;
            if(userId === socket.id) return;
            console.log('Receive paths: ', path)
            canvasRef.current.loadPaths(path);
        })
    }, [])
    

    return (
    <motion.section ref={constraintsRef} className='rounded-xl overflow-hidden relative transition-all w-full h-full  bg-neutral-900'>
        <Image src={doodleImage || ''} width={500} height={500} alt="Doodle" ref={imageRef} className='object-contain w-full h-full' />
        <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={5}
            style={{width: `${canvasSize.width}px`, height: `${canvasSize.height}px`}}
            strokeColor={colorDoodle}
            eraserWidth={10}
            withTimestamp={true}
            canvasColor="transparent"
            onChange={handleChangeCanvas}
            className={twMerge('absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-10 bg-transparent', isDrawing ? 'cursor-drawing' : '', isEraser ? 'cursor-eraser' : '',
            !isDrawing && !isEraser && 'cursor-auto pointer-events-none')}
        />
        {/* <canvas className={twMerge('absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-10', isDrawing ? 'cursor-drawing' : '', isEraser ? 'cursor-eraser' : '')} ref={canvasRef}></canvas> */}
        <motion.div 
            drag
            dragConstraints={constraintsRef}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
            transition={{ duration: 0.3 }}
            whileTap={{ boxShadow: "0px 0px 15px rgba(0,0,0,0.2)" }}
            dragControls={controls} className='z-20 absolute top-2 left-2 p-2 rounded-md bg-white flex flex-col gap-3 cursor-move items-center'>
            <GripHorizontal></GripHorizontal>
            <ButtonDataAction 
            onClick={toggleDrawing}
            className={twMerge('rounded-full px-2 py-2 bg-neutral-50 stroke-neutral-700', isDrawing && 'bg-primary-200 stroke-primary')}>
                <Brush className='h-5 w-5 stroke-inherit' />
            </ButtonDataAction>
            <ButtonDataAction 
            onClick={toggleEraser}
            className={twMerge('rounded-full px-2 py-2 bg-neutral-50 stroke-neutral-700', isEraser && 'bg-primary-200 stroke-primary')}>
                <Eraser className='h-5 w-5 stroke-inherit' />
            </ButtonDataAction>
            <ButtonDataAction 
            onClick={handleUndo}
            className={twMerge('rounded-full px-2 py-2 bg-neutral-50 stroke-neutral-700')}>
                <Undo2 className='h-5 w-5 stroke-inherit' />
            </ButtonDataAction>
            <ButtonDataAction 
            onClick={handleClear}
            className={twMerge('rounded-full px-2 py-2 bg-neutral-50 stroke-neutral-700')}>
                <RotateCcw className='h-5 w-5 stroke-inherit' />
            </ButtonDataAction>
            <ButtonDataAction 
            onClick={handleStopDoodle}
            className={twMerge('rounded-full px-2 py-2 bg-error-400-main stroke-white')}>
                <X className='h-5 w-5 stroke-inherit' />
            </ButtonDataAction>
        </motion.div>
    </motion.section>
    );
};
