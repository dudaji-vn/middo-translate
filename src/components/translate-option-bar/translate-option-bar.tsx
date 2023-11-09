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
import { useToast } from '../toast';
import { useTranslateStore } from '@/stores/translate';

export interface TranslateOptionBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sourceLang?: string;
}

export const TranslateOptionBar = forwardRef<
  HTMLDivElement,
  TranslateOptionBarProps
>(({ sourceLang, ...props }, ref) => {
  const { listening, interimTranscript } = useSpeechRecognition();
  const { setValue, isListening, setIsListening } = useTranslateStore(
    (state) => {
      return {
        setValue: state.setValue,
        isListening: state.isListening,
        setIsListening: state.setIsListening,
      };
    },
  );

  const { toast } = useToast();
  useEffect(() => {
    if (interimTranscript) {
      setValue(interimTranscript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interimTranscript]);

  const ableListen = sourceLang && sourceLang !== 'auto';

  const handleStartListening = () => {
    if (!ableListen) {
      toast({
        description: 'Select a specific language to enable voice input',
        variant: 'destructive',
      });
      return;
    }
    SpeechRecognition.startListening({
      language: supportedVoiceMap[sourceLang as keyof typeof supportedVoiceMap],
      continuous: true,
      interimResults: true,
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    if (listening) {
      setIsListening(true);
    } else {
      setIsListening(false);
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
