import { useEffect, useState } from "react";

export default function useCalcLayoutItem(elementRef: React.RefObject<HTMLElement>, length: number) {
    useEffect(() => {
        let className: string[] = [];
        // calc height
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

        // calc width
        className.push('w-1/4')
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
    }, [elementRef, length])
}