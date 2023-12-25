import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useEffect, useState } from 'react';

import { translateText } from '@/services/languages';
import { useDebounce } from 'usehooks-ts';

export const useTranslate = ({
  sourceLanguage,
  targetLanguage,
  listenMode = 'continuous',
  translateOnType = true,
}: {
  sourceLanguage: string;
  targetLanguage: string;
  listenMode?: 'continuous' | 'manual';
  translateOnType?: boolean;
}) => {
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
      const result = await translateText(
        debounceValue,
        sourceLanguage,
        targetLanguage,
      );
      setTranslatedText(result);
      setIsLoading(false);
    };
    translate();
  }, [
    debounceValue,
    middleText,
    sourceLanguage,
    targetLanguage,
    translateOnType,
  ]);

  const middleTranslate = async (text: string) => {
    const sourceResult = await translateText(text, 'en', sourceLanguage);
    setText(sourceResult);
    setTranslatedText(text);
  };

  const handleMiddleTranslate = () => {
    if (middleText) {
      middleTranslate(middleText);
    }
  };

  const { listening, interimTranscript } = useSpeechRecognition();

  const handleStartListening = () => {
    setText('');
    SpeechRecognition.startListening({
      language: sourceLanguage,
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

  const translate = async (text: string) => {
    setIsLoading(true);
    const translatedText = await translateText(
      text,
      sourceLanguage,
      targetLanguage,
    );
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
  };
};
