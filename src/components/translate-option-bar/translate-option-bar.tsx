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
import { useWindowSize } from 'usehooks-ts';

export interface TranslateOptionBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sourceLang?: string;
}

export const TranslateOptionBar = forwardRef<
  HTMLDivElement,
  TranslateOptionBarProps
>(({ sourceLang, ...props }, ref) => {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const { toast } = useToast();
  const { listening, interimTranscript, finalTranscript } =
    useSpeechRecognition();
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
      });
      return;
    }
    setValue('');
    removeParam('query');
    setIsListening(true);
    SpeechRecognition.startListening({
      language: supportedVoiceMap[sourceLang as keyof typeof supportedVoiceMap],
      continuous: !isMobile,
      interimResults: true,
    });
  };

  const handleStopListening = () => {
    setIsListening(false);
    if (interimTranscript) {
      setParam('query', interimTranscript);
      setValue(interimTranscript);
    }
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
    if (!isMobile) return;
    if (listening) return;
    if (!finalTranscript) return;
    setIsListening(false);
    setParam('query', finalTranscript);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript, listening, isMobile]);

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
