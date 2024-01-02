import {
  LANGUAGE_CODES_MAP,
  SUPPORTED_LANGUAGES,
} from '@/configs/default-language';

export const getLanguageByCode = (languageCode: string) => {
  return SUPPORTED_LANGUAGES.find((language) => language.code === languageCode);
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

  const code = languageCode as keyof typeof LANGUAGE_CODES_MAP;
  if (languageCode in LANGUAGE_CODES_MAP) {
    return LANGUAGE_CODES_MAP[code].toLowerCase();
  }
  return 'us';
};

export const getCountryNameByCode = (countryCode: string) => {
  const language = SUPPORTED_LANGUAGES.find(
    (language) => language.code === countryCode,
  );
  return language?.name || '';
};
