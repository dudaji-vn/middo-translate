import { useEffect, useState } from "react";

export const useElectron = () => {
	const [isElectron, setIsElectron] = useState(false);
    let ipcRenderer = null;
    let electron = null;
    if (typeof window !== "undefined") {
        ipcRenderer = (window as any).ipcRenderer;
        electron = (window as any).electron;
    }

    useEffect(() => {
        const isRunningInElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
        setIsElectron(isRunningInElectron);
    }, []);

    return {
        isElectron,
        ipcRenderer,
        electron
    }
};
