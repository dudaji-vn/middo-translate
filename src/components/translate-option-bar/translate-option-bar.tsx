'use client';

import './style.css';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { forwardRef, useEffect } from 'react';

import { IconButton } from '@/components/button';
import { MicOutline } from '@easy-eva-icons/react';
import { Rectangle } from '@/components/icons';
import { cn } from '@/utils/cn';
import { supportedVoiceMap } from '@/configs/default-language';
import { useSetParams } from '@/hooks/use-set-params';
import { useToast } from '@/components/toast';
import { useTranslateStore } from '@/stores/translate';

export interface TranslateOptionBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sourceLang?: string;
}

export const TranslateOptionBar = forwardRef<
  HTMLDivElement,
  TranslateOptionBarProps
>(({ sourceLang, ...props }, ref) => {
  const { listening, interimTranscript, finalTranscript } =
    useSpeechRecognition({
      clearTranscriptOnListen: true,
    });
  const { setParam, removeParam } = useSetParams();
  const { setValue, isListening, setIsListening, isFocused } =
    useTranslateStore((state) => {
      return {
        setValue: state.setValue,
        isListening: state.isListening,
        setIsListening: state.setIsListening,
        isFocused: state.isFocused,
      };
    });

  const { toast } = useToast();
  useEffect(() => {
    if (interimTranscript) {
      if (finalTranscript) {
        setValue(finalTranscript);
      } else setValue(interimTranscript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interimTranscript, finalTranscript]);

  const ableListen = sourceLang && sourceLang !== 'auto';

  const handleStartListening = () => {
    if (!ableListen) {
      toast({
        description: 'Select a specific language to enable voice input',
      });
      return;
    }
    setValue('');
    removeParam('query');
    SpeechRecognition.startListening({
      language: supportedVoiceMap[sourceLang as keyof typeof supportedVoiceMap],
      // continuous: true,

      interimResults: true,
    });
    setIsListening(true);
  };

  const handleStopListening = () => {
    setIsListening(false);
    setParam('query', finalTranscript);
    setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 500);
  };

  useEffect(() => {
    if (!isListening) {
      handleStopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  useEffect(() => {
    if (!listening) {
      setIsListening(false);
      setParam('query', interimTranscript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  return (
    <div className="relative">
      <div
        ref={ref}
        {...props}
        className={cn(
          'toolWrapper relative',
          listening ? 'animate' : '',
          isFocused && '!hidden md:!block',
        )}
      >
        <div
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            listening ? '' : 'hidden',
          )}
        >
          <div id="mic" className=" w-[228px] " />
        </div>
        {listening ? (
          <IconButton
            size="lg"
            variant="secondary"
            className="relative"
            onClick={handleStopListening}
          >
            <Rectangle />
          </IconButton>
        ) : (
          <IconButton
            shape="circle"
            onClick={handleStartListening}
            size="lg"
            variant="secondary"
            className={cn('z-50', !ableListen && '!opacity-30')}
          >
            <MicOutline className="h-7 w-7" />
          </IconButton>
        )}
      </div>
    </div>
  );
});
TranslateOptionBar.displayName = 'TranslateOptionBar';
