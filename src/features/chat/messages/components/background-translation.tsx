import { detectLanguage, translateText } from '@/services/languages.service';
import { useEffect } from 'react';
import { useDebounce } from 'usehooks-ts';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useMessageEditor } from './message-editor-v2';

export interface BackgroundTranslationProps {}

export const BackgroundTranslation = ({}: BackgroundTranslationProps) => {
  const {
    setContentEnglish,
    content,
    setSrcLang,
    isContentEmpty,
    setTranslating,
    richText,
  } = useMessageEditor();
  const debouncedValue = useDebounce<string>(content, 100); // increase debounce time to decrease cost
  useEffect(() => {
    const handleChange = async (content: string) => {
      setTranslating && setTranslating(true);
      try {
        const detectedLang = await detectLanguage(richText?.getText() || '');
        setSrcLang(detectedLang);
        if (isContentEmpty) {
          setContentEnglish('');
          setTranslating(false);
          return;
        }
        const contentEnglish = await translateText(
          content,
          detectedLang,
          DEFAULT_LANGUAGES_CODE.EN,
        );
        setContentEnglish(contentEnglish);
      } catch (error) {
        console.log('error 😀', error);
      }
      setTranslating(false);
    };

    handleChange(debouncedValue);
  }, [
    debouncedValue,
    isContentEmpty,
    richText,
    setContentEnglish,
    setSrcLang,
    setTranslating,
  ]);

  return <></>;
};
