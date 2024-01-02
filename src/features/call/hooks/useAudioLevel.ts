import { useEffect, useState } from "react";

export default function useAudioLevel(stream: MediaStream) {
    const [isTalk, setIsTalk] = useState(false)

    useEffect(() => {
        var audioContext = new AudioContext();
        var mediaStreamSource = audioContext.createMediaStreamSource(stream);
        var processor = audioContext.createScriptProcessor(2048, 1, 1);
        mediaStreamSource.connect(audioContext.destination);
        mediaStreamSource.connect(processor);
        processor.connect(audioContext.destination);
        processor.onaudioprocess = function (e) {
            var inputData = e.inputBuffer.getChannelData(0);
            var inputDataLength = inputData.length;
            var total = 0;

            for (var i = 0; i < inputDataLength; i++) {
                total += Math.abs(inputData[i++]);
            }
            var rms = Math.sqrt(total / inputDataLength);
            if(rms > 0.1 && !isTalk) setIsTalk(true)
            else if(rms < 0.1 && isTalk) setIsTalk(false)
        };
    }, [isTalk, stream])

    return {
        isTalk
    }
}