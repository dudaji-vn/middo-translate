import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import { textToSpeech } from '@/services/voices.service';

export const useTextToSpeech = (languageCode?: string, _text?: string) => {
  const speak = (text?: string) => {
    if (!languageCode) return console.error('Language code is required');
    const textSpeech = text || _text || '';
    textToSpeech(
      textSpeech,
      SUPPORTED_VOICE_MAP[languageCode as keyof typeof SUPPORTED_VOICE_MAP],
    ).then((bufferData) => {
      playAudio(bufferData);
    });
  };
  return { speak };
};
const playAudio = async (bufferData: number[]) => {
  const blob = new Blob([new Uint8Array(bufferData)], { type: 'audio/mp3' });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
};
