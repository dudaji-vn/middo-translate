import { SOCKET_CONFIG } from "@/configs/socket";
import socket from "@/lib/socket-io";
import { useCallback, useEffect } from "react";
import { useVideoCallStore } from "../../store/video-call.store";
import toast from "react-hot-toast";
import ParticipantInVideoCall from "../../interfaces/participant";
import { VIDEOCALL_LAYOUTS } from "../../constant/layout";
import { useParticipantVideoCallStore } from "../../store/participant.store";
import { IStartDoodlePayload } from "../../interfaces/socket/doodle.interface";
import { useAuthStore } from "@/stores/auth.store";
import { Ban, Brush } from "lucide-react";
import { useMyVideoCallStore } from "../../store/me.store";
import { useElectron } from "@/hooks/use-electron";
import { ELECTRON_EVENTS } from "@/configs/electron-events";

export default function useHandleDoodle() {
    const { setDoodle, setDoodleImage, setDrawing, setLayout, setPinDoodle, setMeDoodle } = useVideoCallStore();
    const { participants } = useParticipantVideoCallStore();
    const { user } = useAuthStore();
    const { setMyOldDoodle } = useMyVideoCallStore();
    const {isElectron, ipcRenderer} = useElectron();
    const doodleStart = useCallback((payload: IStartDoodlePayload) => {
        toast.success(payload.name + ' is start doodle', {icon: <Brush size={20} />});
        setDoodle(true);
        setDoodleImage(payload.image_url);
        const isHavePin = participants.some((p: ParticipantInVideoCall) => p.pin);
        if (!isHavePin) {
            setPinDoodle(true);
            setLayout(VIDEOCALL_LAYOUTS.FOCUS_VIEW);
        }
    },[participants, setDoodle, setDoodleImage, setLayout, setPinDoodle])

    const doodleEnd = useCallback((name: string) => {
        toast.success(name + ' is stop doodle', {icon: <Ban size={20} />});
        setDoodle(false);
        setMyOldDoodle(null)
        setDrawing(false);
        setDoodleImage('');
        setPinDoodle(false);
        setLayout(VIDEOCALL_LAYOUTS.GALLERY_VIEW);
    },[setDoodle, setDoodleImage, setDrawing, setLayout, setMyOldDoodle, setPinDoodle])
    
    useEffect(() => {
        socket.on(SOCKET_CONFIG.EVENTS.CALL.START_DOODLE, doodleStart);
        socket.on(SOCKET_CONFIG.EVENTS.CALL.END_DOODLE,doodleEnd);
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.START_DOODLE);
            socket.off(SOCKET_CONFIG.EVENTS.CALL.END_DOODLE);
        };
    }, [doodleEnd, doodleStart]);

    // Listen event doodle share screen
    const doodleShareScreen = useCallback((payload: { image: string; user: any })=>{
        if(isElectron) {
            ipcRenderer.send(ELECTRON_EVENTS.SEND_DOODLE_SHARE_SCREEN, payload);
        }
    }, [ipcRenderer, isElectron])

    useEffect(() => {
        socket.on(SOCKET_CONFIG.EVENTS.CALL.SEND_DOODLE_SHARE_SCREEN, doodleShareScreen);
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.SEND_DOODLE_SHARE_SCREEN);
        };
    }, [doodleShareScreen]);

    const handleStartDoodle = useCallback(async () => {
        let videoEl = document.querySelector('.focus-view video') as HTMLVideoElement;
        if (!videoEl) return;
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        canvas.getContext('2d')?.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        const quality = 0.2;
        const dataURL = canvas.toDataURL('image/png', quality);
        setMeDoodle(true);
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.START_DOODLE, {
            image_url: dataURL,
            name: user?.name,
        });
        setPinDoodle(true);
    }, [setMeDoodle, setPinDoodle, user?.name])

    return {
        handleStartDoodle
    }
}