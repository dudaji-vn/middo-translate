// @ts-nocheck
import { SOCKET_CONFIG } from '@/configs/socket';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';

interface DrawlingShareScreenProps {
    width: number,
    height: number,
    color: string,
    className?: string,
}

const DrawlingShareScreen = forwardRef<ReactSketchCanvasRef, DrawlingShareScreenProps>((props, ref) => {
    const { width, height, color, className } = props;
    const { user } = useAuthStore();
    const timer = useRef(new Date().getTime());
    const timeout = useRef();
    const handleChangeCanvas = async () => {
        if (!ref || !ref.current) return;
        if (!ref?.current) return;
        // check debounce
        const newTimer = new Date().getTime();
        if (newTimer - timer.current < 100) {
            return;
        }
        timer.current = newTimer;
        if(timeout.current) {
            clearTimeout(timeout.current);
        }
        // Send doodle
        const image = await ref.current?.exportImage('png');
        if (!image) return;
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_DOODLE_SHARE_SCREEN, { image, user });
        timeout.current = setTimeout(() => {
            ref.current?.clearCanvas();
        }, 3000);
    }
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
    );
});

DrawlingShareScreen.displayName = 'DrawlingShareScreen';
export default DrawlingShareScreen;
