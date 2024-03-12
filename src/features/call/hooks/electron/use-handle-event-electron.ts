import { useElectron } from "@/hooks/use-electron";
import useHandleShareScreen from "../socket/use-handle-share-screen";
import { useEffect } from "react";
import { ELECTRON_EVENTS } from "@/configs/electron-events";
import { useVideoCallStore } from "../../store/video-call.store";
import { useMyVideoCallStore } from "../../store/me.store";

export default function useHandleEventElectron() {
    const {isElectron, ipcRenderer} = useElectron();
    const  {stopShareScreen} = useHandleShareScreen();
    const { isTurnOnMic, isTurnOnCamera } = useMyVideoCallStore();
    const { room } = useVideoCallStore();

    // Event Stop Share Screen
    useEffect(()=> {
        if(!isElectron || !ipcRenderer) return;
        ipcRenderer.on(ELECTRON_EVENTS.STOP_SHARE, stopShareScreen);
    }, [ipcRenderer, isElectron, stopShareScreen])

    // Stop Share Screen when leave or switch call
    useEffect(() => {
        if(!isElectron || !ipcRenderer) return;
        ipcRenderer.send(ELECTRON_EVENTS.STOP_SHARE_SCREEN);
    }, [ipcRenderer, isElectron, room])

    // Event Toggle Camera or Mic
    useEffect(() => {
        if(!isElectron || !ipcRenderer) return;
        ipcRenderer.send(ELECTRON_EVENTS.CALL_STATUS, {mic: isTurnOnMic, camera: isTurnOnCamera});
    }, [ipcRenderer, isElectron, isTurnOnCamera, isTurnOnMic])


    if(!isElectron) return;
}
    