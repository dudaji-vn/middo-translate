import {
  languageCodesMap,
  supportedLanguages,
} from '@/configs/default-language';

export const getLanguageByCode = (languageCode: string) => {
  return supportedLanguages.find((language) => language.code === languageCode);
};

export const getCountryCode = (
  languageCode: string | null | undefined,
  allowAuto?: boolean,
) => {
  if (!languageCode) {
    return null;
  }

  if (languageCode === 'auto' && allowAuto) {
    return 'auto';
  }

  const code = languageCode as keyof typeof languageCodesMap;
  if (languageCode in languageCodesMap) {
    return languageCodesMap[code].toLowerCase();
  }
  return 'us';
};
