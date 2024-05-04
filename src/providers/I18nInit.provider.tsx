import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import I18N_SUPPORTED_LANGUAGES from '@/lib/i18n/support_language';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const I18nInitProvider = () => {
  const { i18n } = useTranslation('common');
  useEffect(() => {
    const currentLanguage = localStorage.getItem('i18nLng');
    let lang = '';
    if (!currentLanguage) {
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
        (item) => item.value === currentLanguage,
      );
      lang = isSupport ? currentLanguage : 'en';
    }
    i18n.changeLanguage(lang);
  }, [i18n]);
  return <></>;
};
