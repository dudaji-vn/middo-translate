import { detectLanguage, translateText } from '@/services/languages.service';
import { useEffect, useState } from 'react';

import { useDebounce } from 'usehooks-ts';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import useSpeechRecognizer from '@/hooks/use-speech-recognizer';
import { useAuthStore } from '@/stores/auth.store';
import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';

export const useTranslate = ({
  srcLang: _srcLang,
  tgtLang: _tgtLang,
  listenMode = 'continuous',
  translateOnType = true,
  onDetectLanguage,
}: {
  srcLang: string;
  tgtLang: string;
  listenMode?: 'continuous' | 'manual';
  translateOnType?: boolean;
  onDetectLanguage?: (lang: string) => void;
}) => {
  const [srcLang, setSrcLang] = useState(_srcLang);
  const [tgtLang, setTgtLang] = useState(_tgtLang);
  const [detLang, setDetLang] = useState('');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [middleText, setMiddleText] = useState('');
  const { user } = useAuthStore();
  const debounceValue = useDebounce(text, 500);
  const call = useVideoCallStore((state) => state.call);
  const canNotListen = !!call;

  useEffect(() => {
    if (!translateOnType) return;
    if (middleText) return;
    if (!debounceValue) {
      setTranslatedText('');
      return;
    }
    const translate = async () => {
      setIsLoading(true);
      let srcLangToUse = srcLang;
      if (srcLang === 'auto') {
        const detectedLang = await detectLanguage(debounceValue);
        srcLangToUse = detectedLang;
        onDetectLanguage?.(detectedLang);
        setDetLang(detectedLang);
      }

      const result = await translateText(debounceValue, srcLangToUse, tgtLang);
      setTranslatedText(result);
      setIsLoading(false);
    };
    translate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, middleText, srcLang, tgtLang, translateOnType]);

  const middleTranslate = async (text: string) => {
    setIsLoading(true);
    const sourceResult = await translateText(text, 'en', detLang);
    setText(sourceResult);
    setTranslatedText(text);
    setIsLoading(false);
  };

  const handleMiddleTranslate = () => {
    if (middleText) {
      middleTranslate(middleText);
    }
  };

  const {
    listening,
    interimTranscript,
    startSpeechToText,
    stopSpeechToText,
    resetTranscript,
  } = useSpeechRecognizer(
    SUPPORTED_VOICE_MAP[user?.language as keyof typeof SUPPORTED_VOICE_MAP],
  );

  const handleStartListening = (lang?: string) => {
    if (canNotListen) return;
    setText('');
    startSpeechToText();
  };

  const handleStopListening = () => {
    if (listening) {
      stopSpeechToText();
      // resetTranscript();
    }
  };

  useEffect(() => {
    if (interimTranscript && listening && !canNotListen) {
      setText(interimTranscript);
    }
  }, [canNotListen, interimTranscript, listening]);

  const reset = () => {
    setText('');
    setTranslatedText('');
  };
  useEffect(() => {
    if (_srcLang) {
      setSrcLang(_srcLang);
    }
  }, [_srcLang]);
  const translate = async (text: string) => {
    setIsLoading(true);
    let srcLangToUse = srcLang;
    if (srcLang === 'auto') {
      const detectedLang = await detectLanguage(text);
      srcLangToUse = detectedLang;
      setSrcLang(detectedLang);
      onDetectLanguage?.(detectedLang);
      setDetLang(detectedLang);
    }
    const translatedText = await translateText(text, srcLangToUse, tgtLang);
    setIsLoading(false);
    return {
      originalText: text,
      translatedText: translatedText,
    };
  };

  const setDetToSrc = () => {
    setSrcLang(detLang);
  };

  return {
    text,
    setText,
    translatedText,
    middleText,
    setMiddleText,
    middleTranslate,
    handleMiddleTranslate,
    handleStartListening,
    listening: listening && !canNotListen,
    interimTranscript,
    handleStopListening,
    isLoading,
    reset,
    translate,
    detLang,
    srcLang,
    setSrcLang,
    setDetToSrc,
  };
};
