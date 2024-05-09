import useAudioLevel from "@/hooks/use-audio-level";
import { useEffect, useRef, useState } from "react";

export default function useCheckTalk(stream?: MediaStream) {
    const [isTalk, setIsTalk] = useState(false)
    const {level} = useAudioLevel(stream);
    const timerId = useRef<NodeJS.Timeout>();
    useEffect(() => {
        if(!stream) return;
        if(stream.getAudioTracks().length === 0) return;
        if(timerId.current) clearTimeout(timerId.current)
        if(level > 10 && !isTalk){
            setIsTalk(true)
        } else if(level <= 10 && isTalk){
            setIsTalk(false)
        }
        timerId.current = setTimeout(() => {
            setIsTalk(false)
        }, 3000)
    }, [isTalk, level, stream])

    return {
        isTalk
    }
}