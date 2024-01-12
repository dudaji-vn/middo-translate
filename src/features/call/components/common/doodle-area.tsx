import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ButtonDataAction from '@/components/actions/button/button-data-action';
import { Brush, Eraser, GripHorizontal, ImageIcon, RotateCcw, Undo2, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { motion, useDragControls } from "framer-motion"
import { CanvasPath, ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { useVideoCallStore } from '../../store/video-call.store';

export const DoodleArea = () => {
    const { doodleImage, setConfirmStopDoodle, colorDoodle, isMeDoole } = useVideoCallStore();
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const canvasAnotherParticipantRef = useRef<ReactSketchCanvasRef>(null);
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
    const handleChangeCanvas = async (path: CanvasPath, isEraser: boolean) => {
        if(!canvasRef.current) return;
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE, {
            path,
            isEraser,
            width: canvasSize.width,
            height: canvasSize.height
        })
    }

    useEffect(() => {
        const fillCanvasToImage = async () => {
            if(!imageRef.current) return;
            const ratio = imageRef.current.naturalWidth/imageRef.current.naturalHeight
            let width = imageRef.current.height*ratio
            let height = imageRef.current.height
            if(width > window.innerWidth) {
                width = imageRef.current.width
                height = imageRef.current.width/ratio
            }
            setCanvasSize({width, height})
            // Update paths
            // if(!canvasRef.current || !canvasAnotherParticipantRef.current) return;
            // const paths = await canvasRef.current?.exportPaths();
            // if(paths) {
            //     const newPaths = paths.map((path: any) => {
            //         return {
            //             ...path,
            //             x: path.x*(width/canvasSize.width),
            //             y: path.y*(height/canvasSize.height)
            //         }
            //     })
            //     canvasRef.current?.loadPaths(newPaths);
            // }
            // const pathParticipant = await canvasAnotherParticipantRef.current?.exportPaths();
            // if(pathParticipant) {
            //     const newPaths = pathParticipant.map((path: any) => {
            //         return {
            //             ...path,
            //             x: path.x*(width/canvasSize.width),
            //             y: path.y*(height/canvasSize.height)
            //         }
            //     })
            //     canvasAnotherParticipantRef.current?.loadPaths(newPaths);
            // }
        }
        window.addEventListener('resize', fillCanvasToImage);
        window.addEventListener('load', fillCanvasToImage);
        fillCanvasToImage();
        return () => {
            window.removeEventListener('resize', fillCanvasToImage);
            window.removeEventListener('load', fillCanvasToImage);
        }
    }, [canvasSize.height, canvasSize.width]);

    useEffect(() => {
        // Event draw doodle
        socket.on(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE, async ( payload: {path: CanvasPath; isEraser: boolean, userId: string, width: number, height: number}) => {
            if(!canvasRef.current) return;
            if(payload.userId === socket.id) return;
            const paths = payload.path.paths.map(path => {
                return {
                    ...path,
                    x: path.x*(canvasSize.width/payload.width),
                    y: path.y*(canvasSize.height/payload.height)
                }
            })
            const path = {
                ...payload.path,
                paths
            }
            if(payload.isEraser) {
                canvasAnotherParticipantRef.current?.eraseMode(true);
            } else {
                canvasAnotherParticipantRef.current?.eraseMode(false);
            }
            canvasAnotherParticipantRef.current?.loadPaths([path]);
            
        })
        // Event have user request get doodle data
        socket.on(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA, async (payload: { path: CanvasPath, userId: string, width: number, height: number, isEraser: boolean }[]) => {
            if(!canvasRef.current) return;
            payload.map((data) => {
                let paths = data.path.paths.map(path => {
                    return {
                        ...path,
                        x: path.x*(canvasSize.width/data.width),
                        y: path.y*(canvasSize.height/data.height)
                    }
                })
                const path = {
                    ...data.path,
                    paths
                }
                if(data.isEraser) {
                    canvasRef.current?.eraseMode(true);
                    canvasAnotherParticipantRef.current?.eraseMode(true);
                }
                if(data.userId === socket.id) {
                    canvasRef.current?.loadPaths([path]);
                } else {
                    canvasAnotherParticipantRef.current?.loadPaths([path]);
                }
                canvasRef.current?.eraseMode(false);
                canvasAnotherParticipantRef.current?.eraseMode(false);
            })

        })

        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE)
            socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA)
        }
    }, [canvasSize.height, canvasSize.width])

    useEffect(() => {
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA)
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
            onStroke={handleChangeCanvas}
            className={twMerge('absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-10 bg-transparent', isDrawing ? 'cursor-drawing' : '', isEraser ? 'cursor-eraser' : '',
            !isDrawing && !isEraser && 'cursor-auto pointer-events-none')}
        />
        <ReactSketchCanvas
            ref={canvasAnotherParticipantRef}
            style={{width: `${canvasSize.width}px`, height: `${canvasSize.height}px`}}
            withTimestamp={true}
            strokeWidth={5}
            allowOnlyPointerType="none"
            canvasColor="transparent"
            className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-[9] pointer-events-none cursor-none"
        />
        <motion.div 
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
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
            {isMeDoole && <ButtonDataAction 
            onClick={handleStopDoodle}
            className={twMerge('rounded-full px-2 py-2 bg-error-400-main stroke-white')}>
                <X className='h-5 w-5 stroke-inherit' />
            </ButtonDataAction> }
        </motion.div>
    </motion.section>
    );
};
