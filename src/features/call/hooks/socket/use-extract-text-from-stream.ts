
import { useEffect, useState } from "react";
import { useMyVideoCallStore } from "../../store/me.store";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { SUPPORTED_VOICE_MAP } from "@/configs/default-language";
import { useAuthStore } from "@/stores/auth.store";

const useExtractTextFromStream = () => {
    const { myStream } = useMyVideoCallStore();
    const { resetTranscript, finalTranscript, interimTranscript } = useSpeechRecognition(); 
    const { user } = useAuthStore();
    useEffect(() => {
        if (!myStream) return;
        if (!myStream.getAudioTracks().length) return;
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(myStream);
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
                SpeechRecognition.startListening({ 
                    continuous: true,
                    language: SUPPORTED_VOICE_MAP[(user?.language || 'auto') as keyof typeof SUPPORTED_VOICE_MAP],
                    interimResults: true
                });
            } else if (rms <= 0.2 && starting) {
                if(!startNoSound) startNoSound = new Date();
                timer = new Date();
                if((timer.getTime() - startNoSound.getTime()) > 1000) {
                    starting = false;
                    SpeechRecognition.stopListening();
                    resetTranscript();
                }
            }
        };

        return () => {
            microphone.disconnect();
            analyser.disconnect();
            scriptProcessor.disconnect();
        };
        
    }, [myStream, resetTranscript, user?.language]);


    return {
        transcript: finalTranscript
    }
};

export default useExtractTextFromStream;