import { useCallback, useEffect, useState } from 'react';

export default function usePlayAudio(audioLink: string) {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  useEffect(() => {
    setAudio(new Audio(audioLink));
  }, [audioLink]);

  const playAudio = useCallback(() => {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    audio.addEventListener('ended', () => {
      audio.play();
    });
  }, [audio]);

  const stopAudio = useCallback(() => {
    if (!audio) return;
    if(audio.paused) return;
    audio.pause();
    audio.currentTime = 0;
  }, [audio]);

  return { playAudio, stopAudio };
}
