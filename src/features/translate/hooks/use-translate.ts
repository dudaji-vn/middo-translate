import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { detectLanguage, translateText } from '@/services/languages';
import { useEffect, useState } from 'react';

import { useDebounce } from 'usehooks-ts';

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
  _srcLang;
  const [srcLang, setSrcLang] = useState(_srcLang);
  const [tgtLang, setTgtLang] = useState(_tgtLang);
  const [detLang, setDetLang] = useState('');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [middleText, setMiddleText] = useState('');

  const debounceValue = useDebounce(text, 500);

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
    const sourceResult = await translateText(text, 'en', srcLang);
    setText(sourceResult);
    setTranslatedText(text);
  };

  const handleMiddleTranslate = () => {
    if (middleText) {
      middleTranslate(middleText);
    }
  };

  const { listening, interimTranscript } = useSpeechRecognition();

  const handleStartListening = (lang?: string) => {
    setText('');
    SpeechRecognition.startListening({
      language: lang || srcLang,
      continuous: listenMode === 'continuous',
      interimResults: true,
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    if (interimTranscript && listening) {
      setText(interimTranscript);
    }
  }, [interimTranscript, listening]);

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

  return {
    text,
    setText,
    translatedText,
    middleText,
    setMiddleText,
    middleTranslate,
    handleMiddleTranslate,
    handleStartListening,
    listening,
    interimTranscript,
    handleStopListening,
    isLoading,
    reset,
    translate,
    detLang,
    srcLang,
    setSrcLang,
  };
};
