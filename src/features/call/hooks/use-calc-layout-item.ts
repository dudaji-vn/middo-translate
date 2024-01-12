import { useEffect, useState } from "react";
import { useVideoCallStore } from "../store/video-call.store";
import { VIDEOCALL_LAYOUTS } from "../constant/layout";

export default function useCalcLayoutItem(elementRef: React.RefObject<HTMLElement>, length: number) {
    const { layout, isFullScreen } = useVideoCallStore();
    useEffect(() => {
        let className: string[] = [];
        if(layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW && isFullScreen) {
            className.push('h-full')
        } else {
            switch (true) {
                case length <= 4:
                    className.push('h-full')
                    className.push('md:h-1/2')
                    break;
                case length <= 8:
                    className.push('h-1/2')
                    className.push('md:h-1/4')
                    break;
                case length <= 12:
                    className.push('h-1/2')
                    className.push('md:h-1/3')
                    break;
                default:
                    className.push('h-1/2')
                    className.push('md:h-1/4')
                    break;
            }
        }

        // calc width
        if(layout == VIDEOCALL_LAYOUTS.FOCUS_VIEW && isFullScreen) {
            className.push('w-full')
        } else {
            className.push('md:w-1/4')
            className.push('w-1/2')
        }
        // switch (true) {
        //     case length % 4 === 0:
        //         className.push('w-1/4')
        //         break;
        //     case length % 2 === 0:
        //         className.push('w-1/2')
        //         break;
        //     case length % 3 === 0:
        //         className.push('w-1/3')
        //         break;
        //     default:
        //         className.push('w-full')
        //         break;
        // }

        if(elementRef.current) elementRef.current.classList.add(...className)
    }, [elementRef, layout, isFullScreen, length])
}