'use client';

import './style.css';

import { forwardRef, useCallback, useEffect } from 'react';

import { Button } from '@/components/actions';
import { MicIcon } from 'lucide-react';
import { Rectangle } from '@/components/icons';
import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { useSetParams } from '@/hooks/use-set-params';
import { useTranslateStore } from '@/stores/translate.store';
import { useWindowSize } from 'usehooks-ts';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import useSpeechRecognizer from '@/hooks/use-speech-recognizer';
import { useTranslation } from 'react-i18next';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import customToast from '@/utils/custom-toast';

export interface TranslateOptionBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sourceLang?: string;
}

export const TranslateOptionBar = forwardRef<
  HTMLDivElement,
  TranslateOptionBarProps
>(({ sourceLang, ...props }, ref) => {
  const { width } = useWindowSize();
  const { postMessage } = useReactNativePostMessage();
  const isMobile = width < 768;
  let {
    listening,
    interimTranscript,
    startSpeechToText,
    stopSpeechToText,
    finalTranscript,
    resetTranscript,
  } = useSpeechRecognizer(
    SUPPORTED_VOICE_MAP[sourceLang as keyof typeof SUPPORTED_VOICE_MAP],
  );
  const { setParam, removeParam } = useSetParams();
  const { t } = useTranslation('common');
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
      customToast.error(t('MESSAGE.ERROR.NOT_SELECTED_LANGUAGE'));
      return;
    }

    // request permission
    postMessage({
      type: 'Trigger',
      data: { type: 'mic', value: !listening },
    });
    await navigator?.mediaDevices?.getUserMedia({ audio: true });
    setValue('');
    removeParam('query');
    setIsListening(true);
    startSpeechToText();
  };
  const handleStopListening = useCallback(() => {
    setIsListening(false);
    if (interimTranscript) {
      setParam('query', interimTranscript);
      setValue(interimTranscript);
    }
    try {
      stopSpeechToText();
      // resetTranscript();
    } catch {}
  }, [interimTranscript, setIsListening, setParam, setValue, stopSpeechToText]);

  useKeyboardShortcut([SHORTCUTS.TOGGLE_SPEECH_TO_TEXT], () =>
    isListening ? handleStopListening() : handleStartListening(),
  );

  useEffect(() => {
    return () => {
      setIsListening(false);
      stopSpeechToText();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceLang]);

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
          'toolWrapper relative dark:bg-neutral-950 dark:border-neutral-900 dark:border dark:shadow-3',
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
              disabled={!isListening}
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
