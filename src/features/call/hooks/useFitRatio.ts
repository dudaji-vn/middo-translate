import React, { useEffect } from "react";

export default function useFitRatio(elementRef: React.RefObject<HTMLVideoElement> | React.RefObject<HTMLImageElement>) {
    useEffect(() => {
        const handleCheckRatioVideo = () => {
            if(!elementRef.current) return;
            let width = 0
            let height = 0
            if(elementRef.current instanceof HTMLImageElement) {
                width = elementRef.current.naturalWidth
                height = elementRef.current.naturalHeight
                console.log("Image", width, height)
            }
            if(elementRef.current instanceof HTMLVideoElement) {
                width = elementRef.current.videoWidth
                height = elementRef.current.videoHeight
                console.log("Video", width, height)
            }
            if(window.innerWidth / window.innerHeight > width / height) {
                elementRef.current.style.width = '100%'
                elementRef.current.style.height = 'auto'
            } else if (window.innerWidth / window.innerHeight < width / height) {
                elementRef.current.style.width = 'auto'
                elementRef.current.style.height = '100%'
            } else {
                elementRef.current.style.width = '100%'
                elementRef.current.style.height = '100%'
            }
            
        }
        window.addEventListener('resize', handleCheckRatioVideo)
        handleCheckRatioVideo()
        return () => {
            window.removeEventListener('resize', handleCheckRatioVideo)
        }
    }, [elementRef])
}