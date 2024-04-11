import { useEffect, useState } from "react";

export default function useAudioLevel(stream?: MediaStream) {
    const [isTalk, setIsTalk] = useState(false)

    useEffect(() => {
        if(!stream) return;
        if(stream.getAudioTracks().length === 0) return;
        var audioContext = new AudioContext();
        var mediaStreamSource = audioContext.createMediaStreamSource(stream);
        var processor = audioContext.createScriptProcessor(2048, 1, 1);
        mediaStreamSource.connect(audioContext.destination);
        mediaStreamSource.connect(processor);
        processor.connect(audioContext.destination);
        let isTalkTemp = false;
        let timerId:NodeJS.Timeout | null = null;
        processor.onaudioprocess = function (e) {
            if(timerId) clearTimeout(timerId);
            var inputData = e.inputBuffer.getChannelData(0);
            var inputDataLength = inputData.length;
            var total = 0;
            for (var i = 0; i < inputDataLength; i++) {
                total += Math.abs(inputData[i++]);
            }
            var rms = Math.sqrt(total / inputDataLength);
            if(rms > 0.1 && !isTalkTemp){
                setIsTalk(true)
                isTalkTemp = true;
            }
            else if(rms < 0.1 && isTalkTemp) {
                setIsTalk(false)
                isTalkTemp = false;
            }
            timerId = setTimeout(() => {
                setIsTalk(false)
            }, 2000)
        };
        return () => {
            if(!mediaStreamSource) return;
            processor.disconnect(audioContext.destination);
            mediaStreamSource.disconnect(processor);
            mediaStreamSource.disconnect(audioContext.destination);
        }
    }, [stream])

    return {
        isTalk
    }
}