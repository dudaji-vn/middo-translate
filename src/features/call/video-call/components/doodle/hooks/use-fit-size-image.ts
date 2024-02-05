import debounce from "@/utils/debounce";
import { useEffect, useState } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
interface IUseFitSizeImage {
    imageRef: React.RefObject<HTMLImageElement>;
    canvasRef: React.RefObject<ReactSketchCanvasRef>;
}
export default function useFitSizeImage({imageRef, canvasRef}:IUseFitSizeImage) {
    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0})
    useEffect(() => {
        const fillCanvasToImage = debounce(async () => {
            if(!imageRef.current) return;
            const ratio = imageRef.current.naturalWidth/imageRef.current.naturalHeight
            let width = imageRef.current.height*ratio
            let height = imageRef.current.height
            if(width > window.innerWidth) {
                width = imageRef.current.width
                height = imageRef.current.width/ratio
            }
            setCanvasSize({width, height})

            // Re calculate paths of canvas
            const paths = await canvasRef.current?.exportPaths();
            if(!paths || paths.length === 0) return;
            const newPaths = paths.map((path: any) => {
                return {
                    ...path,
                    paths: path.paths.map((p: any) => {
                        return {
                            ...p,
                            x: p.x/(canvasSize.width || 1) * width,
                            y: p.y/(canvasSize.height || 1) * height
                        }
                    })
                }
            })
            canvasRef.current?.resetCanvas();
            canvasRef.current?.loadPaths(newPaths);

        }, 300)
        window.addEventListener('resize', fillCanvasToImage);

        const imageRefInstant = imageRef.current;
        if(imageRef.current) {
            imageRef.current.addEventListener('load', fillCanvasToImage);
        }
        fillCanvasToImage();
        return () => {
            window.removeEventListener('resize', fillCanvasToImage);
            if(imageRefInstant) {
                imageRefInstant.removeEventListener('load', fillCanvasToImage);
            }
        }
    }, [canvasRef, canvasSize.height, canvasSize.width, imageRef]);

    return {
        width: canvasSize.width,
        height: canvasSize.height
    };
}