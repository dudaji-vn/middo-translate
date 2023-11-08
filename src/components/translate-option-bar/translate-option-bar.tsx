'use client';

import './style.css';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { forwardRef, useEffect } from 'react';

import { IconButton } from '../button';
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
  const { setParam, removeParam, searchParams } = useSetParams();

  const isListening = searchParams.get('listening') === 'true';

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
        // title: 'Can not listen',
        description: 'Select a specific language to enable voice input',
        variant: 'destructive',
      });
      return;
    }
    SpeechRecognition.startListening({
      language: supportedVoiceMap[sourceLang as keyof typeof supportedVoiceMap],
      continuous: true,
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    if (listening) {
      setParam('listening', 'true');
    } else {
      removeParam('listening');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  useEffect(() => {
    if (!isListening) {
      handleStopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn('toolWrapper transition-all', listening && '!w-[284px] ')}
    >
      {listening ? (
        <IconButton
          onClick={() => {
            SpeechRecognition.stopListening();
          }}
        >
          <div className="h-6 w-6 rounded-[4px] bg-primary"></div>
        </IconButton>
      ) : (
        <IconButton
          shape="circle"
          onClick={handleStartListening}
          size="lg"
          variant="secondary"
          className={cn(!ableListen && '!opacity-30')}
        >
          <MicOutline className="h-7 w-7 " />
        </IconButton>
      )}
    </div>
  );
});
TranslateOptionBar.displayName = 'TranslateOptionBar';
