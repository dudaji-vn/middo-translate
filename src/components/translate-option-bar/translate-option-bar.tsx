'use client';

import './style.css';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { forwardRef, useEffect } from 'react';

import { MicOutline } from '@easy-eva-icons/react';
import { cn } from '@/utils/cn';
import { supportedVoiceMap } from '@/configs/default-language';
import { useSetParams } from '@/hooks/use-set-params';
import { useToast } from '../toast';

export interface TranslateOptionBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sourceLang?: string;
}

export const TranslateOptionBar = forwardRef<
  HTMLDivElement,
  TranslateOptionBarProps
>(({ sourceLang, ...props }, ref) => {
  const { transcript, listening } = useSpeechRecognition();
  const { setParam, removeParam } = useSetParams();

  const { toast } = useToast();
  useEffect(() => {
    if (transcript) {
      setParam('query', transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const ableListen = sourceLang && sourceLang !== 'auto';

  const handleStartListening = () => {
    if (!ableListen) {
      toast({
        title: 'Can not listen',
        description: 'Please choose a language to listen',
        variant: 'destructive',
      });
      return;
    }
    SpeechRecognition.startListening({
      language: supportedVoiceMap[sourceLang as keyof typeof supportedVoiceMap],
      continuous: true,
    });
  };

  return (
    <div
      ref={ref}
      {...props}
      className={cn('toolWrapper transition-all', listening && '!w-[284px] ')}
    >
      {listening ? (
        <button
          onClick={() => {
            SpeechRecognition.stopListening();
          }}
          className="circleButton big"
        >
          <div className="h-6 w-6 rounded-[4px] bg-primary"></div>
        </button>
      ) : (
        <button
          onClick={handleStartListening}
          className={cn('circleButton big', !ableListen && '!opacity-30')}
        >
          <MicOutline className="h-7 w-7 text-primary" />
        </button>
      )}
    </div>
  );
});
TranslateOptionBar.displayName = 'TranslateOptionBar';
