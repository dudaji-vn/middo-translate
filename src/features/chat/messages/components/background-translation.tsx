import { detectLanguage, translateText } from '@/services/languages.service';
import { useEffect } from 'react';
import { useDebounce } from 'usehooks-ts';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useMessageEditor } from './message-editor-v2';

export interface BackgroundTranslationProps {}

export const BackgroundTranslation = ({}: BackgroundTranslationProps) => {
  const { setContentEnglish, content, setSrcLang } = useMessageEditor();
  const debouncedValue = useDebounce<string>(content, 100);
  useEffect(() => {
    const handleChange = async (content: string) => {
      const detectedLang = await detectLanguage(content);
      setSrcLang(detectedLang);
      const contentEnglish = await translateText(
        content,
        detectedLang,
        DEFAULT_LANGUAGES_CODE.EN,
      );
      setContentEnglish(contentEnglish);
    };

    handleChange(debouncedValue);
  }, [debouncedValue, setContentEnglish, setSrcLang]);

  return <></>;
};
