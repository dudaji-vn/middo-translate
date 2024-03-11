
import { useEffect } from "react";
import { SUPPORTED_VOICE_MAP } from "@/configs/default-language";
import { useAuthStore } from "@/stores/auth.store";
import useSpeechRecognizer from "@/hooks/use-speech-recognizer";

const useExtractTextFromStream = (stream?: MediaStream) => {
    const { user } = useAuthStore();
    const { startSpeechToText, stopSpeechToText, finalTranscript, resetTranscript } = useSpeechRecognizer(SUPPORTED_VOICE_MAP[(user?.language || 'auto') as keyof typeof SUPPORTED_VOICE_MAP]);
    useEffect(() => {
        if (!stream) return;
        if (!stream.getAudioTracks().length) return;
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;
        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        let starting = false;
        let timer = new Date();
        let startNoSound: Date | null = null;
        scriptProcessor.onaudioprocess = function (event) {
            var inputData = event.inputBuffer.getChannelData(0);
            var inputDataLength = inputData.length;
            var total = 0;
            for (var i = 0; i < inputDataLength; i++) {
                total += Math.abs(inputData[i++]);
            }
            var rms = Math.sqrt(total / inputDataLength);
            if (rms > 0.2 && !starting) {
                starting = true;
                startNoSound = null;
                startSpeechToText()
            } else if (rms <= 0.2 && starting) {
                if(!startNoSound) startNoSound = new Date();
                timer = new Date();
                if((timer.getTime() - startNoSound.getTime()) > 1000) {
                    starting = false;
                    stopSpeechToText();
                    resetTranscript();
                }
            }
        };

        return () => {
            microphone.disconnect();
            analyser.disconnect();
            scriptProcessor.disconnect();
        };
        
    }, [startSpeechToText, stopSpeechToText, stream]);


    return {
        transcript: finalTranscript
    }
};

export default useExtractTextFromStream;