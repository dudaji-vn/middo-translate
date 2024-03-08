import debounce from "@/utils/debounce";
import { useEffect, useState } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
interface IUseGetVideoSize {
    videoRef: React.RefObject<HTMLVideoElement>;
}
export default function useGetVideoSize({videoRef}:IUseGetVideoSize) {
    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0})
    useEffect(() => {
        const getVideoSize = debounce(async () => {
            if(!videoRef.current) return;
            setCanvasSize({width: videoRef.current.offsetWidth, height: videoRef.current.offsetHeight})
        }, 300)
        window.addEventListener('resize', getVideoSize);

        const videoRefInstant = videoRef.current;
        if(videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', getVideoSize);
        }
        getVideoSize();
        return () => {
            window.removeEventListener('resize', getVideoSize);
            if(videoRefInstant) {
                videoRefInstant.removeEventListener('loadedmetadata', getVideoSize);
            }
        }
    }, [videoRef]);

    return {
        width: canvasSize.width,
        height: canvasSize.height
    };
}