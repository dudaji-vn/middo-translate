import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import I18N_SUPPORTED_LANGUAGES from '@/lib/i18n/support_language';
import { useAppStore } from '@/stores/app.store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const I18nInitProvider = () => {
  const setLanguage = useAppStore(state => state.setLanguage);
  const language = useAppStore(state => state.language);
  const { i18n } = useTranslation('common');
  useEffect(() => {
    let lang = '';
    if (!language) {
      const browserLanguage = navigator.language;
      let deceiveLanguage = 'en';
      for (const [key, value] of Object.entries(SUPPORTED_VOICE_MAP)) {
        if (value == browserLanguage) {
          deceiveLanguage = key;
          break;
        }
      }
      const isSupport = I18N_SUPPORTED_LANGUAGES.find(
        (item) => item.value === deceiveLanguage,
      );
      lang = isSupport ? deceiveLanguage : 'en';
    } else {
      const isSupport = I18N_SUPPORTED_LANGUAGES.find(
        (item) => item.value === language,
      );
      lang = isSupport ? language : 'en';
    }
    i18n.changeLanguage(lang);
  }, [i18n, language, setLanguage]);
  return <></>;
};
