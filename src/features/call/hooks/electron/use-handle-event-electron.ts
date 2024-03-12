import { useElectron } from "@/hooks/use-electron";
import useHandleShareScreen from "../socket/use-handle-share-screen";
import { useCallback, useEffect } from "react";
import { ELECTRON_EVENTS } from "@/configs/electron-events";
import { useVideoCallStore } from "../../store/video-call.store";
import { useMyVideoCallStore } from "../../store/me.store";

export default function useHandleEventElectron() {
    const {isElectron, ipcRenderer} = useElectron();
    const  {stopShareScreen} = useHandleShareScreen();
    const { isTurnOnMic, isTurnOnCamera } = useMyVideoCallStore();
    const { room } = useVideoCallStore();

    const onStopShareScreen = useCallback(()=> {
        stopShareScreen();
    }, [stopShareScreen]);

    useEffect(() => {
        if(!isElectron || !ipcRenderer) return;
        ipcRenderer.on(ELECTRON_EVENTS.STOP_SHARE, onStopShareScreen);

        return () => {
            if(!isElectron || !ipcRenderer) return;
            ipcRenderer.off(ELECTRON_EVENTS.STOP_SHARE, onStopShareScreen);
        }
      }, [ipcRenderer, isElectron, onStopShareScreen])

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
    