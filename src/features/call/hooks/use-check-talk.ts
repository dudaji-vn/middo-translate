import useAudioLevel from "@/hooks/use-audio-level";
import { useEffect, useState } from "react";

export default function useCheckTalk(stream?: MediaStream) {
    const [isTalk, setIsTalk] = useState(false)
    const {level} = useAudioLevel(stream);
    useEffect(() => {
        if(!stream) return;
        if(stream.getAudioTracks().length === 0) return;
        let timerId: NodeJS.Timeout;
        if(level > 10 && !isTalk){
            setIsTalk(true)
        } else if(level <= 10 && isTalk){
            setIsTalk(false)
        }
        timerId = setTimeout(() => {
            setIsTalk(false)
        }, 5000)
        return () => {
            if(timerId) clearTimeout(timerId);
        }
    }, [isTalk, level, stream])

    return {
        isTalk
    }
}