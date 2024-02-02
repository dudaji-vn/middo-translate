import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Brush, ChevronDown, ChevronUp, Eraser, GripHorizontal, RotateCcw, Undo2, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { motion, useDragControls } from "framer-motion"

import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/actions';
import debounce from '@/utils/debounce';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import trimLongName from '@/features/call/utils/trim-long-name.util';
import { ModalConfirmClearDoodle } from '@/features/call/components/common/modal/modal-confirm-clear-doodle';
type IDoodleImage = Record<string, {
    user: any,
    image: string,
    color: string
}>;

export const DoodleArea = () => {
    const { user } = useAuthStore();
    const { doodleImage, setConfirmStopDoodle, colorDoodle, isMeDoole } = useVideoCallStore();
    const { myOldDoodle, setMyOldDoodle } = useMyVideoCallStore();
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const { isDrawing, setDrawing } = useVideoCallStore();
    const controls = useDragControls()

    const [isEraser, setIsEraser] = useState(false);
    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0})
    const [imagesCanvas, setImagesCanvas] = useState<IDoodleImage>({})
    const [isShowColor, setShowColor] = useState(false);
    const [isShowConfirmClear, setShowConfirmClear] = useState(false);
    const constraintsRef = useRef(null)

    const timer = useRef(new Date().getTime());

    const imagesCanvasArray = useMemo(()=>{
        return Object.values(imagesCanvas).map((item) => item.image);
    }, [imagesCanvas])

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
    
    const handleChangeCanvas = async () => {
        if(!canvasRef.current) return;
        // check debounce
        const newTimer = new Date().getTime();
        if(newTimer - timer.current < 100) {
            return;
        }
        timer.current = newTimer;

        // Send doodle
        const image = await canvasRef.current?.exportImage('png');
        if(!image) return;
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE, {
            image,
            user,
            color: colorDoodle
        })

        // get Paths
        const path = await canvasRef.current?.exportPaths();
        if(!path) return;
        setMyOldDoodle(path);
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
        const fillCanvasToImage = debounce(async () => {
            if(!imageRef.current) return;
            const ratio = imageRef.current.naturalWidth/imageRef.current.naturalHeight
            let width = imageRef.current.height*ratio
            let height = imageRef.current.height
            if(width > window.innerWidth) {
                width = imageRef.current.width
                height = imageRef.current.width/ratio
            }
            setCanvasSize({width, height})

            // Re calculate paths of canvas
            const paths = await canvasRef.current?.exportPaths();
            if(!paths || paths.length === 0) return;
            const newPaths = paths.map((path) => {
                return {
                    ...path,
                    paths: path.paths.map((p) => {
                        return {
                            ...p,
                            x: p.x/(canvasSize.width || 1) * width,
                            y: p.y/(canvasSize.height || 1) * height
                        }
                    })
                }
            })
            canvasRef.current?.resetCanvas();
            canvasRef.current?.loadPaths(newPaths);

        }, 300)
        window.addEventListener('resize', fillCanvasToImage);

        const imageRefInstant = imageRef.current;
        if(imageRef.current) {
            imageRef.current.addEventListener('load', fillCanvasToImage);
        }
        fillCanvasToImage();
        return () => {
            window.removeEventListener('resize', fillCanvasToImage);
            if(imageRefInstant) {
                imageRefInstant.removeEventListener('load', fillCanvasToImage);
            }
        }
    }, [canvasSize.height, canvasSize.width]);

    useEffect(() => {
        // Event draw doodle
        socket.on(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE, async ( payload: {image: string, user: any, color: string, socketId: string }) => {
            if(!canvasRef.current) return;
            if(payload.socketId === socket.id) return;
            const currentImagesCanvas = {...imagesCanvas};
            currentImagesCanvas[payload.socketId] = {
                user: payload.user,
                image: payload.image,
                color: payload.color
            }
            setImagesCanvas(currentImagesCanvas);
        })
        // Event receive doodle
        socket.on(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA, async (payload: Record<string, { user: any; image: string; color: string }>) => {
            if(!canvasRef.current) return;
            const currentImagesCanvas = {...imagesCanvas};
            for(const [key, value] of Object.entries(payload)) {
                if(key === socket.id) continue;
                currentImagesCanvas[key] = value
            }
            setImagesCanvas(currentImagesCanvas);
        })

        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE)
            socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA)
        }
    }, [imagesCanvas])
    
    useEffect(() => {
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA)
    }, [])

    useEffect(() => {
        if(!canvasRef.current || !myOldDoodle) return;
        const checkToLoadOldDoodle = async () => {
            if(!myOldDoodle || myOldDoodle.length == 0) return;
            let currentPaths = await canvasRef.current?.exportPaths();
            if(!currentPaths || currentPaths.length === 0) {
                setTimeout(()=>{
                    canvasRef.current?.loadPaths(myOldDoodle);
                }, 500)
                return;
            }
        }
        checkToLoadOldDoodle();
    }, [myOldDoodle])
    
    return (
    <motion.section ref={constraintsRef} className='rounded-xl overflow-hidden relative transition-all w-full h-full  bg-neutral-900'>
        <Image src={doodleImage || ''} width={500} height={500} alt="Doodle" ref={imageRef} className='object-contain w-full h-full' />
        <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={Math.max(canvasSize.width/160, 2)}
            style={{width: `${canvasSize.width}px`, height: `${canvasSize.height}px`}}
            strokeColor={colorDoodle}
            eraserWidth={10}
            withTimestamp={true}
            canvasColor="transparent"
            onChange={handleChangeCanvas}
            // onStroke={handleSavePath}
            className={twMerge('absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-10 bg-transparent', isDrawing ? 'cursor-drawing' : '', isEraser ? 'cursor-eraser' : '',
            !isDrawing && !isEraser && 'cursor-auto pointer-events-none')}
        />
        {imagesCanvasArray.map((src, index) => (
            src && <div 
                key={index} 
                style={{width: `${canvasSize.width}px`, height: `${canvasSize.height}px`}} 
                className='absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-[9] bg-transparent'>
                <Image width={1000} height={1000} src={src} alt="Image" className='w-full h-full object-cover'/>
            </div>
        ))}
        <motion.div 
            drag
            dragListener={false}
            dragConstraints={constraintsRef}
            dragMomentum={false}
            whileTap={{ boxShadow: "0px 0px 15px rgba(0,0,0,0.2)" }}
            dragControls={controls} className='z-20 absolute top-2 left-2 p-2 rounded-md bg-white flex flex-col gap-3 items-center'>
            <div onPointerDown={(e) => controls.start(e)} className='cursor-move'>
                <GripHorizontal></GripHorizontal>
            </div>
            <Button.Icon
                variant='default'
                size='xs'
                color={isDrawing ? 'primary' : 'default'}
                onClick={toggleDrawing}
            >
                <Brush />
            </Button.Icon>
            <Button.Icon
                variant='default'
                size='xs'
                color={isEraser ? 'primary' : 'default'}
                onClick={toggleEraser}
            >
                <Eraser />
            </Button.Icon>
            <Button.Icon
                variant='default'
                size='xs'
                color='default'
                onClick={handleUndo}
            >
                <Undo2 />
            </Button.Icon>
            <Button.Icon
                variant='default'
                size='xs'
                color='default' 
                onClick={()=>setShowConfirmClear(true)}
            >
                <RotateCcw />
            </Button.Icon>
            {isMeDoole && 
            <Button.Icon 
                variant='default'
                size='xs'
                color='error'
                onClick={handleStopDoodle}
            >
                <X />
            </Button.Icon> }
            <div className='flex flex-col items-center'>
                {isShowColor && <ul className='border-t border-neutral-50 pt-4 pb-4 max-h-[180px] flex-1 w-full overflow-auto'>
                    <ul className='w-full flex flex-col justify-center items-center gap-5 '>
                        <li className='flex flex-col justify-center items-center gap-1'>
                            <div className='w-3 h-3 rounded-full' style={{backgroundColor: colorDoodle}}></div>
                            <span className='text-sm'>You</span>
                        </li>
                        {Object.values(imagesCanvas).map((item, index) => {
                            if(item.user._id === user?._id) return;
                            return (
                                <li key={index} className='flex flex-col justify-center items-center gap-1'>
                                    <div className='w-3 h-3 rounded-full' style={{backgroundColor: item.color}}></div>
                                    <span className='text-sm'>{trimLongName(item.user.name, 3)}</span>
                                </li>
                            )
                        })}
                    </ul>
                </ul>}
                <div className="border-t border-neutral-50 ">
                    <Button.Icon
                        variant='ghost'
                        size='xs'
                        color='default' 
                        onClick={()=>setShowColor(!isShowColor)}
                    >
                        {isShowColor ? <ChevronUp /> : <ChevronDown />}
                    </Button.Icon>
                </div>
            </div>
        </motion.div>
        <ModalConfirmClearDoodle
            isOpen={isShowConfirmClear} 
            toggleModal={()=>setShowConfirmClear(false)}
            handleSubmit={handleReset}
        ></ModalConfirmClearDoodle>
    </motion.section>
    );
};
