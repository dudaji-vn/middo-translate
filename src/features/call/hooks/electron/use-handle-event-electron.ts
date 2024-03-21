import { useElectron } from "@/hooks/use-electron";
import { useEffect } from "react";
import { ELECTRON_EVENTS } from "@/configs/electron-events";
import { useVideoCallStore } from "../../store/video-call.store";
import { useMyVideoCallStore } from "../../store/me.store";

export default function useHandleEventElectron() {
    const {isElectron, ipcRenderer} = useElectron();
    const { isTurnOnMic, isTurnOnCamera } = useMyVideoCallStore();
    const { room } = useVideoCallStore();

    // Stop Share Screen when leave or switch call
    useEffect(() => {
        if(!isElectron || !ipcRenderer) return;
        ipcRenderer.send(ELECTRON_EVENTS.STOP_SHARE_SCREEN);
    }, [ipcRenderer, isElectron, room?._id])

    // Event Toggle Camera or Mic
    useEffect(() => {
        if(!isElectron || !ipcRenderer) return;
        ipcRenderer.send(ELECTRON_EVENTS.CALL_STATUS, {mic: isTurnOnMic, camera: isTurnOnCamera});
    }, [ipcRenderer, isElectron, isTurnOnCamera, isTurnOnMic])


    if(!isElectron) return;
}
    