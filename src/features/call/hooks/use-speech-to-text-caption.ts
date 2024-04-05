import { useCallback, useEffect, useRef, useState } from 'react';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useMyVideoCallStore } from '../store/me.store';
interface WordRecognized {
  isFinal: boolean;
  text: string;
}
export default function useSpeechToTextCaption(language?: string) {
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [stream, setStream] = useState<MediaStream>();
  const [isListening, setIsListening] = useState(false);
  const {isTurnOnMic} = useMyVideoCallStore();
  const processorRef = useRef<any>();
  const audioContextRef = useRef<any>();
  const audioInputRef = useRef<any>();
  const receiveAudioText = useCallback((data: WordRecognized) => {
    // remove /n in data.text
    const transcript = data.text.replace(/\n/g, '');
    const isFinal = data.isFinal;
    if (isFinal) {
      setFinalTranscript(transcript);
    }
  }, []);

  const startListen = useCallback(async ()=>{
    setIsListening(true);
    socket.emit(SOCKET_CONFIG.EVENTS.SPEECH_TO_TEXT.START, language);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: 'default',
        sampleRate: 16000,
        sampleSize: 16,
        channelCount: 1,
      },
      video: false,
    });
    setStream(stream);
  }, [language])
 

  const stopListen = useCallback(()=>{
    setIsListening(false);
    socket.emit(SOCKET_CONFIG.EVENTS.SPEECH_TO_TEXT.STOP);
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    processorRef.current?.disconnect();
    audioInputRef.current?.disconnect();
    audioContextRef.current?.close();
  }, [stream])

  useEffect(() => {
    if(isTurnOnMic && !isListening) {
      startListen();
    } else if(!isTurnOnMic && isListening) {
      stopListen();
    }
  }, [isListening, isTurnOnMic, startListen, stopListen]);

  useEffect(() => {
    if(!isListening) return;
    socket.on(
      SOCKET_CONFIG.EVENTS.SPEECH_TO_TEXT.RECEIVE_AUDIO_TEXT,
      receiveAudioText,
    );
    return () => {
      socket.off(
        SOCKET_CONFIG.EVENTS.SPEECH_TO_TEXT.RECEIVE_AUDIO_TEXT,
        receiveAudioText,
      );
    };
  }, [isListening, receiveAudioText]);

  useEffect(() => {
    const init = async () => {
      if (!stream) return;
      audioContextRef.current = new window.AudioContext();

      await audioContextRef.current.audioWorklet.addModule(
        '/src/worklets/recorderWorkletProcessor.js',
      );

      audioContextRef.current.resume();

      audioInputRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      processorRef.current = new AudioWorkletNode(
        audioContextRef.current,
        'recorder.worklet',
      );

      processorRef.current.connect(audioContextRef.current.destination);
      audioContextRef.current.resume();

      audioInputRef.current.connect(processorRef.current);

      processorRef.current.port.onmessage = (event: any) => {
        const audioData = event.data;
        socket.emit(SOCKET_CONFIG.EVENTS.SPEECH_TO_TEXT.SEND_AUDIO, {
          audio: audioData,
        });
      };
    };
    init();
  }, [stream]);

  useEffect(() => {
    // Stop stream when component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      processorRef.current?.disconnect();
      audioInputRef.current?.disconnect();
      audioContextRef.current?.close();
    };
  }, [stream]);

  


  return {
    transcript: finalTranscript,
  };
}
