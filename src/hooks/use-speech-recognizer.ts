import { NEXT_PUBLIC_GOOGLE_SPEECH_TO_TEXT_API_KEY } from '@/configs/env.public';
import useSpeechToText from 'react-hook-speech-to-text';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useElectron } from './use-electron';
export default function useSpeechRecognizer(
    language?: string
) {
    const { isElectron } = useElectron();
    
    // let { error, isRecording, interimResult, results, setResults, startSpeechToText, stopSpeechToText } = useSpeechToText({
    //     continuous: true,
    //     crossBrowser: true,
    //     useLegacyResults: false,
    //     // timeout: 200,
    //     googleApiKey: NEXT_PUBLIC_GOOGLE_SPEECH_TO_TEXT_API_KEY,
    //     googleCloudRecognitionConfig: {
    //         languageCode: language || 'en-US'
    //     },
    //     useOnlyGoogleCloud: isElectron ? true : false,
    // });

    const {
        transcript,
        listening,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition()
    
    // let finalTranscript = results.map((result) => {
    //     if (typeof result === 'string') return result;
    //     return result.transcript;
    // }).join(' ');

    // let interimTranscript = interimResult;
    // if(!interimTranscript && results.length > 0) {
    //     interimTranscript = finalTranscript
    // }

    // const resetTranscript = () => {
    //     setResults([])
    // }
    const setResults = () => {}
    const startSpeechToText = () => { 
        SpeechRecognition.startListening({ 
            continuous: true,
            language: language || 'en-US' 
        });
    }

    const stopSpeechToText = () => {
        SpeechRecognition.stopListening();
    }


    return {
        error: null, listening, interimTranscript, finalTranscript, startSpeechToText, stopSpeechToText,resetTranscript,
        setResults
    };
}

