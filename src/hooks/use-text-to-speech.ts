import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import { textToSpeech } from '@/services/voices.service';
import { useAppStore } from '@/stores/app.store';
import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = (
  languageCode?: string,
  _text?: string,
): { speak: (text?: string) => void; stop: () => void; isPlaying: boolean } => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { currentAudio, setCurrentAudio } = useAppStore((state) => {
    return {
      currentAudio: state.currentAudio,
      setCurrentAudio: state.setCurrentAudio,
    };
  });

  useEffect(() => {
    const handleAudioPause = () => {
      setIsPlaying(false);
    };

    if (audio) {
      audio.addEventListener('pause', handleAudioPause);
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('pause', handleAudioPause);
      }
    };
  }, [audio]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setAudio(null);
    }
  }, [audio]);

  const speak = (text?: string) => {
    if (!languageCode) return console.error('Language code is required');
    const textSpeech = text || _text || '';
    textToSpeech(
      textSpeech,
      SUPPORTED_VOICE_MAP[languageCode as keyof typeof SUPPORTED_VOICE_MAP],
    ).then((bufferData) => {
      stop();
      setIsPlaying(true);
      playAudio(bufferData);
    });
  };

  const playAudio = async (bufferData: number[]) => {
    const blob = new Blob([new Uint8Array(bufferData)], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const newAudio = new Audio(url);
    newAudio.addEventListener('ended', () => {
      setIsPlaying(false);
      setAudio(null);
    });

    // Pause current audio if it's playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Set the new audio as the current audio
    setCurrentAudio(newAudio);

    // Play the new audio
    newAudio.play();

    // Set the new audio to state
    setAudio(newAudio);
  };

  return { speak, stop, isPlaying };
};
