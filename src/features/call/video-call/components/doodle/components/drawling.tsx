// @ts-nocheck
import { SOCKET_CONFIG } from '@/configs/socket';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import React, { forwardRef, useEffect, useRef } from 'react'
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';

interface DrawlingProps {
    width: number,
    height: number,
    color: string,
    className?: string,
}

const Drawling = forwardRef<ReactSketchCanvasRef, DrawlingProps>((props, ref) => {
    const { width, height, color, className } = props;

    const user = useAuthStore(state => state.user);
    const myOldDoodle  = useMyVideoCallStore(state => state.myOldDoodle);
    const setMyOldDoodle = useMyVideoCallStore(state => state.setMyOldDoodle);

    const timer = useRef(new Date().getTime());

    const handleChangeCanvas = async () => {
        if (!ref || !ref.current) return;
        if (!ref?.current) return;
        // check debounce
        const newTimer = new Date().getTime();
        if (newTimer - timer.current < 100) {
            return;
        }
        timer.current = newTimer;
        // Send doodle
        const image = await ref.current?.exportImage('png');
        if (!image) return;
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE, {
            image,
            user,
            color: color
        })

        // get Paths
        const path = await ref.current?.exportPaths();
        if (!path) return;
        setMyOldDoodle(path);
    }

    useEffect(() => {
        if(!ref.current || !myOldDoodle) return;
        const checkToLoadOldDoodle = async () => {
            if(!myOldDoodle || myOldDoodle.length == 0) return;
            let currentPaths = await ref.current?.exportPaths();
            if(!currentPaths || currentPaths.length === 0) {
                setTimeout(()=>{
                    ref.current?.loadPaths(myOldDoodle);
                }, 500)
                return;
            }
        }
        checkToLoadOldDoodle();
    }, [myOldDoodle, ref])


    

    return (
        <ReactSketchCanvas
            ref={ref}
            strokeWidth={Math.max(width / 160, 2)}
            style={{ width: `${width}px`, height: `${height}px` }}
            strokeColor={color}
            eraserWidth={10}
            withTimestamp={true}
            canvasColor="transparent"
            onChange={handleChangeCanvas}
            // onStroke={handleSavePath}
            // className={twMerge('absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 z-10 bg-transparent', isDrawing ? 'cursor-drawing' : '', isEraser ? 'cursor-eraser' : '',
            // !isDrawing && !isEraser && 'cursor-auto pointer-events-none')}
            className={className}
        />
    )
})

Drawling.displayName = 'Drawling';
export default Drawling
