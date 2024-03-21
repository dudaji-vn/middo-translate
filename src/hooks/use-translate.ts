import { useEffect, useState } from 'react';

import { DEFAULT_LANGUAGES_CODE, SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import { translateText } from '@/services/languages.service';
import { useDebounce } from 'usehooks-ts';
import { useMessageEditorText } from '@/features/chat/messages/components/message-editor/message-editor-text-context';
import useSpeechRecognizer from './use-speech-recognizer';
import { useAuthStore } from '@/stores/auth.store';

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
  const [englishText, setEnglishText] = useState('');
  const [translatedEnglishText, setTranslatedEnglishText] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [middleText, setMiddleText] = useState('');

  const debounceValue = useDebounce(text, 500);

  const { user } = useAuthStore();

  useEffect(() => {
    if (!translateOnType) return;
    if (middleText) return;
    if (debounceValue) {
      const translate = async () => {
        setIsLoading(true);
        if (sourceLanguage === DEFAULT_LANGUAGES_CODE.EN) {
          const result = await translateText(
            debounceValue,
            sourceLanguage,
            targetLanguage,
          );
          setTranslatedText(result);
          setIsLoading(false);

          return;
        }

        if (targetLanguage === DEFAULT_LANGUAGES_CODE.EN) {
          const result = await translateText(
            debounceValue,
            sourceLanguage,
            targetLanguage,
          );
          setEnglishText(result);
          setIsLoading(false);

          return;
        }
        const englishText = await translateText(
          debounceValue,
          sourceLanguage,
          DEFAULT_LANGUAGES_CODE.EN,
        );
        const translatedFromEnglish = await translateText(
          englishText,
          DEFAULT_LANGUAGES_CODE.EN,
          targetLanguage,
        );
        setEnglishText(englishText);
        setTranslatedText(translatedFromEnglish);
        // const result = await translateText(
        //   debounceValue,
        //   sourceLanguage,
        //   targetLanguage,
        // );
        // setTranslatedText(result);

        // const [sourceEnglish, targetEnglish] = await Promise.all([
        //   translateText(debounceValue, sourceLanguage, 'en'),
        //   translateText(result, targetLanguage, 'en'),
        // ]);
        // setEnglishText(sourceEnglish);
        // setTranslatedEnglishText(targetEnglish);
        setIsLoading(false);
      };
      translate();
    } else {
      setTranslatedText('');
      setEnglishText('');
      setTranslatedEnglishText('');
    }
  }, [
    debounceValue,
    middleText,
    sourceLanguage,
    targetLanguage,
    translateOnType,
  ]);

  const middleTranslate = async (text: string) => {
    const [sourceResult, targetResult] = await Promise.all([
      translateText(text, 'en', sourceLanguage),
      translateText(text, 'en', targetLanguage),
    ]);
    setText(sourceResult);
    if (targetLanguage === DEFAULT_LANGUAGES_CODE.EN) return;
    setTranslatedText(targetResult);
  };

  const handleMiddleTranslate = () => {
    if (middleText) {
      setEnglishText(middleText);
      middleTranslate(middleText);
    }
  };


  const {listening, interimTranscript, startSpeechToText, stopSpeechToText} = useSpeechRecognizer(
    SUPPORTED_VOICE_MAP[user?.language as keyof typeof SUPPORTED_VOICE_MAP]
  );

  const handleStartListening = (lang?: string) => {
    setText('');
    startSpeechToText();
  };

  const handleStopListening = () => {
    stopSpeechToText();
  };

  useEffect(() => {
    if (interimTranscript) {
      setText(interimTranscript);
    }
  }, [interimTranscript]);

  const reset = () => {
    setText('');
    setTranslatedText('');
    setEnglishText('');
    setTranslatedEnglishText('');
  };

  const translate = async (text: string) => {
    setIsLoading(true);
    let translatedText = '';
    let englishText = '';
    if (sourceLanguage === DEFAULT_LANGUAGES_CODE.EN) {
      englishText = text;
    } else {
      englishText = await translateText(
        text,
        sourceLanguage,
        DEFAULT_LANGUAGES_CODE.EN,
      );
    }

    if (targetLanguage === DEFAULT_LANGUAGES_CODE.EN) {
      translatedText = englishText;
    } else {
      translatedText = await translateText(
        text,
        sourceLanguage,
        targetLanguage,
      );
    }
    setIsLoading(false);
    return {
      originalText: text,
      englishText: englishText,
      translatedText: translatedText,
    };
  };

  return {
    text,
    setText,
    translatedText,
    englishText,
    setEnglishText,
    translatedEnglishText,
    setTranslatedEnglishText,
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
