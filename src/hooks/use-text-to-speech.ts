import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import { textToSpeech } from '@/services/voices';

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
  const audioArrayBuffer = new Uint8Array(bufferData).buffer;
  const audioCtx = new window.AudioContext();
  const audioData = await audioCtx.decodeAudioData(audioArrayBuffer);
  const source = audioCtx.createBufferSource();
  source.buffer = audioData;
  source.connect(audioCtx.destination);
  source.start();
};
