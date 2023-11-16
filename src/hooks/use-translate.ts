import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useEffect, useState } from 'react';

import { translateText } from '@/services/languages';
import { useDebounce } from 'usehooks-ts';

export const useTranslate = ({
  sourceLanguage,
  targetLanguage,
}: {
  sourceLanguage: string;
  targetLanguage: string;
}) => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [translatedEnglishText, setTranslatedEnglishText] = useState('');

  const [middleText, setMiddleText] = useState('');

  const debounceValue = useDebounce(text, 500);

  useEffect(() => {
    if (middleText) return;
    if (debounceValue) {
      const translate = async () => {
        const englishText = await translateText(
          debounceValue,
          sourceLanguage,
          'en',
        );
        const translatedFromEnglish = await translateText(
          englishText,
          'en',
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
      };
      translate();
    } else {
      setTranslatedText('');
      setEnglishText('');
      setTranslatedEnglishText('');
    }
  }, [debounceValue, middleText, sourceLanguage, targetLanguage]);

  const middleTranslate = async (text: string) => {
    const [sourceResult, targetResult] = await Promise.all([
      translateText(text, 'en', sourceLanguage),
      translateText(text, 'en', targetLanguage),
    ]);
    setText(sourceResult);
    setTranslatedText(targetResult);
  };

  const handleMiddleTranslate = () => {
    if (middleText) {
      setEnglishText(middleText);
      middleTranslate(middleText);
    }
  };

  const { listening, interimTranscript, finalTranscript } =
    useSpeechRecognition();

  const handleStartListening = () => {
    setText('');
    SpeechRecognition.startListening({
      language: sourceLanguage,
      continuous: true,
      interimResults: true,
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    if (interimTranscript) {
      setText(interimTranscript);
    }
  }, [interimTranscript]);

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
  };
};
