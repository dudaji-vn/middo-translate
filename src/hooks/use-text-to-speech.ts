import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import { textToSpeech } from '@/services/voices.service';
import { useState } from 'react';

export const useTextToSpeech = (
  languageCode?: string,
  _text?: string,
): { speak: (text?: string) => void; stop: () => void; isPlaying: boolean } => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

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
    const audio = new Audio(url);
    setAudio(audio);
    audio.play();
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setAudio(null);
    });
  };

  const stop = () => {
    if (audio) {
      console.log('stop');
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setAudio(null);
    }
  };

  return { speak, stop, isPlaying };
};
