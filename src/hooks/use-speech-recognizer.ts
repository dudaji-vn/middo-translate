import { useElectron } from './use-electron';
import { useCallback, useEffect, useRef, useState } from 'react';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
interface WordRecognized {
  isFinal: boolean;
  text: string;
}
export default function useSpeechRecognizer(language?: string) {
  const { isElectron } = useElectron();
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [stream, setStream] = useState<MediaStream>();
  const [history, setHistory] = useState<string[]>([]);
  const processorRef = useRef<any>();
  const audioContextRef = useRef<any>();
  const audioInputRef = useRef<any>();

  const {
    interimTranscript: interimTranscriptBrowser,
    listening: listeningBrowser,
    finalTranscript: finalTranscriptBrowser,
  } = useSpeechRecognition();

  const receiveAudioText = useCallback(
    (data: WordRecognized) => {
      const transcript = data.text;
      const isFinal = data.isFinal;
      if (isFinal) {
        setHistory((old) => [...old, transcript]);
      }
      const completedTranscript = history.join(' ') + transcript;
      setFinalTranscript(completedTranscript);
      setInterimTranscript(completedTranscript);
    },
    [history],
  );

  useEffect(() => {
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
  }, [receiveAudioText]);

  useEffect(() => {
    const init = async () => {
      if (!stream || !isElectron) return;
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
  }, [isElectron, stream]);

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
      if (isElectron) socket.emit(SOCKET_CONFIG.EVENTS.SPEECH_TO_TEXT.STOP);
    };
  }, [isElectron]);

  const startSpeechToText = async () => {
    if (isElectron) {
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
    } else {
      SpeechRecognition.startListening({
        continuous: true,
        language: language,
      });
    }
  };

  const stopSpeechToText = () => {
    if (isElectron) {
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
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const resetTranscript = () => {
    setInterimTranscript('');
    setFinalTranscript('');
    setHistory([]);
  };

  return {
    listening: isElectron ? listening : listeningBrowser,
    interimTranscript: isElectron
      ? interimTranscript
      : interimTranscriptBrowser,
    finalTranscript: isElectron ? finalTranscript : finalTranscriptBrowser,
    startSpeechToText,
    stopSpeechToText,
    resetTranscript,
  };
}
