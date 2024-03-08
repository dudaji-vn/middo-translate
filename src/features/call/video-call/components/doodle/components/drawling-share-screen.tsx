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
    const ctxRef = useRef(null);
    const [drawings, setDrawings] = useState([]); // Array to store drawings with timestamps
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(width / 160, 2);
        ctxRef.current = ctx;
    }, [color, ref, width]);

    const startDrawing = (e) => {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );
        setIsDrawing(true);
    };

    const endDrawing = () => {
        ctxRef.current.closePath();
        setIsDrawing(false);
        const newDrawings = [...drawings, { path: ctxRef.current, timestamp: Date.now() }];
        setDrawings(newDrawings);
    };

    const draw = (e) => {
        if (!isDrawing) {
            return;
        }
        ctxRef.current.lineTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );
        ctxRef.current.stroke();
    };
    
    useEffect(() => {
        const clearOldestDrawing = setInterval(() => {
            const currentTime = Date.now();
            const newDrawings = drawings.filter(draw => currentTime - draw.timestamp < 3000); 
            setDrawings(newDrawings);
        }, 1000); // Check every second
        return () => clearInterval(clearOldestDrawing);
    }, [drawings]);

    useEffect(() => {
        // Clear canvas and redraw all stored drawings
        const canvas = ref.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawings.forEach(draw => {
            ctx.save();
            draw.path.stroke();
            ctx.restore();
        });
    }, [drawings, ref]);

    useEffect(() => {
        const canvas = ref.current;
        const image = canvas.toDataURL("image/png");
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_DOODLE_SHARE_SCREEN, { image, user });
    }, [drawings, ref, user]);
    return (
        <canvas
            ref={ref}
            width={width}
            height={height}
            className={className}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
        />
    );
});

DrawlingShareScreen.displayName = 'DrawlingShareScreen';
export default DrawlingShareScreen;
