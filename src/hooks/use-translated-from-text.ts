import { getLanguageByCode } from '@/utils/language-fn';
import { useTranslation } from 'react-i18next';

export const useTranslatedFromText = ({
  languageCode,
}: {
  languageCode: string;
}) => {
  const { t } = useTranslation('common');
  const translatedFrom =
    t('COMMON.TRANSLATED_FROM') +
    ' ' +
    t('LANGUAGE.' + getLanguageByCode(languageCode)?.name);
  getLanguageByCode(languageCode)?.name;
  if (!languageCode) return '';
  return translatedFrom;
};
