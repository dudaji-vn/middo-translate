import { useEffect, useState } from "react";

export default function useAudioLevel(stream?: MediaStream) {
    const [level, setLevel] = useState(0)
    useEffect(() => {
        if(!stream) return;
        if(stream.getAudioTracks().length === 0) return;
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;
        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;
            const length = array.length;
            for (let i = 0; i < length; i++) {
                values += array[i];
            }
            const average = values / length;
            setLevel(average);
        };
    }, [stream])

    return {
        level
    }
}