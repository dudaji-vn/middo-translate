'use client';

import { CopyOutline, VolumeUpOutline } from '@easy-eva-icons/react';

import { IconButton } from '../button';
import React from 'react';
import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { cn } from '@/utils/cn';
import { supportedVoiceMap } from '@/configs/default-language';
import { textToSpeech } from '@/services/voices';
import { useAdjustTextStyle } from '@/hooks/use-adjust-text-style';
import { useToast } from '../toast';
import { useWindowSize } from 'usehooks-ts';

export interface TranslateResultProps {
  result: string;
  languageCode?: string;
  children?: React.ReactNode;
  hasResult?: boolean;
}

export const TranslateResult = ({
  result,
  languageCode,
  children,
}: TranslateResultProps) => {
  const textStyle = useAdjustTextStyle(result);
  const { width } = useWindowSize();
  const { toast } = useToast();

  const isMobile = width < 768;

  const playAudio = async (bufferData: number[]) => {
    const audioArrayBuffer = new Uint8Array(bufferData).buffer;
    const audioCtx = new window.AudioContext();
    const audioData = await audioCtx.decodeAudioData(audioArrayBuffer);
    const source = audioCtx.createBufferSource();
    source.buffer = audioData;
    source.connect(audioCtx.destination);
    source.start();
  };
  const speak = async () => {
    const bufferData = await textToSpeech(
      result,
      supportedVoiceMap[languageCode as keyof typeof supportedVoiceMap],
    );
    playAudio(bufferData);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast({ description: 'Text copied!' });
  };

  return (
    <TranslateEditorWrapper
      className={cn('md:flex-1', !!result ? 'block' : 'hidden md:block')}
      type="result"
      topElement={isMobile && children}
      bottomElement={!isMobile && children}
      languageCode={languageCode}
    >
      <div className={`translatedText ${textStyle} break-words`}>{result}</div>
      <div className="absolute bottom-5 right-5 flex ">
        <IconButton onClick={speak} variant="ghostPrimary">
          <VolumeUpOutline />
        </IconButton>
        <IconButton onClick={handleCopy} variant="ghostPrimary">
          <CopyOutline />
        </IconButton>
      </div>
    </TranslateEditorWrapper>
  );
};
