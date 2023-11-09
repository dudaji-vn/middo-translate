'use client';

import './style.css';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { forwardRef, useEffect } from 'react';

import { IconButton } from '../button';
import { MicOutline } from '@easy-eva-icons/react';
import { Rectangle } from '../icons';
import { cn } from '@/utils/cn';
import { supportedVoiceMap } from '@/configs/default-language';
import { useToast } from '../toast';
import { useTranslateStore } from '@/stores/translate';
import { useWaveForm } from '@/hooks/use-wave-form';

export interface TranslateOptionBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sourceLang?: string;
}

export const TranslateOptionBar = forwardRef<
  HTMLDivElement,
  TranslateOptionBarProps
>(({ sourceLang, ...props }, ref) => {
  const { listening, interimTranscript } = useSpeechRecognition();
  const { handleRecordClick } = useWaveForm();
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
    handleRecordClick();
    setValue('');
    SpeechRecognition.startListening({
      language: supportedVoiceMap[sourceLang as keyof typeof supportedVoiceMap],
      continuous: true,
      interimResults: true,
    });
  };

  const handleStopListening = () => {
    handleRecordClick();
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
          <div id="mic" className=" w-[228px] "></div>
        </div>
        {listening ? (
          <IconButton
            size="lg"
            variant="secondary"
            className="relative"
            onClick={() => {
              SpeechRecognition.stopListening();
            }}
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
            <MicOutline className="h-7 w-7 " />
          </IconButton>
        )}
      </div>
    </div>
  );
});
TranslateOptionBar.displayName = 'TranslateOptionBar';
