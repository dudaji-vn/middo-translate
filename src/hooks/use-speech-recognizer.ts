import { useCallback, useEffect, useRef, useState } from 'react';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
interface WordRecognized {
  isFinal: boolean;
  text: string;
}
export default function useSpeechRecognizer(language?: string) {
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [stream, setStream] = useState<MediaStream>();
  const [history, setHistory] = useState<string[]>([]);
  const processorRef = useRef<any>();
  const audioContextRef = useRef<any>();
  const audioInputRef = useRef<any>();
  
  const receiveAudioText = useCallback(
    (data: WordRecognized) => {
      // remove /n in data.text
      const transcript = data.text.replace(/\n/g, '');
      const isFinal = data.isFinal;
      if (isFinal) {
        setHistory((old) => [...old, transcript]);
      }
      setInterimTranscript((history.join(' ') + transcript));
    },
    [history],
  );

  useEffect(() => {
    if(!listening) return;
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
  }, [listening, receiveAudioText]);

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

  useEffect(() => {
    return () => {
      socket.emit(SOCKET_CONFIG.EVENTS.SPEECH_TO_TEXT.STOP);
    };
  }, []);

  const resetTranscript = useCallback(() => {
    setInterimTranscript('');
    setFinalTranscript('');
    setHistory([]);
  }, []);

  const startSpeechToText = useCallback(async () => {
    resetTranscript();
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
    setListening(true);
  }, [language, resetTranscript]);

  const stopSpeechToText = useCallback(() => {
    socket.emit(SOCKET_CONFIG.EVENTS.SPEECH_TO_TEXT.STOP);
    processorRef.current?.disconnect();
    audioInputRef.current?.disconnect();
    audioContextRef.current?.close();
    setListening(false);
    // stop stream if needed
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    setStream(undefined);
    socket.off(
      SOCKET_CONFIG.EVENTS.SPEECH_TO_TEXT.RECEIVE_AUDIO_TEXT,
      receiveAudioText,
    );
    setFinalTranscript(history.join(' ') || interimTranscript);
    
  }, [history, interimTranscript, receiveAudioText, stream]);

  

  return {
    listening: listening,
    interimTranscript: interimTranscript,
    finalTranscript: finalTranscript,
    startSpeechToText,
    stopSpeechToText,
    resetTranscript: resetTranscript,
  };
}
