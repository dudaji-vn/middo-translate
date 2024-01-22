'use client';

import './style.css';

import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { forwardRef, useEffect } from 'react';

import { Button } from '@/components/actions';
import { MicIcon } from 'lucide-react';
import { Rectangle } from '@/components/icons';
import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { useSetParams } from '@/hooks/use-set-params';
import { useTranslateStore } from '@/stores/translate.store';
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

  const handleStartListening = async () => {
    if (!ableListen) {
      toast.error('Please select a language to listen');
      return;
    }

    // request permission
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const isAllowed = SpeechRecognition.browserSupportsSpeechRecognition();
    if (!isAllowed) {
      toast.error('Your browser is not supported');
      return;
    }
    setValue('');
    removeParam('query');
    setIsListening(true);
    SpeechRecognition.startListening({
      language:
        SUPPORTED_VOICE_MAP[sourceLang as keyof typeof SUPPORTED_VOICE_MAP],
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
          <>
            <Button.Icon
              size="lg"
              color="secondary"
              className="relative shrink-0"
              onClick={handleStopListening}
            >
              <Rectangle />
            </Button.Icon>
            <span>Listening</span>
          </>
        ) : (
          <Button.Icon
            onClick={handleStartListening}
            size="lg"
            color="secondary"
            className={cn('z-10', !ableListen && '!opacity-30')}
          >
            <MicIcon className="h-7 w-7" />
          </Button.Icon>
        )}
      </div>
    </div>
  );
});
TranslateOptionBar.displayName = 'TranslateOptionBar';
