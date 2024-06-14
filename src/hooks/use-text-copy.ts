import customToast from '@/utils/custom-toast';
import { useTranslation } from 'react-i18next';

export const useTextCopy = (_text?: string) => {
  const {t} = useTranslation('common');
  const copy = (text?: string) => {
    const textToCopy = text || _text || '';
    if(!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      customToast.success(t('MESSAGE.SUCCESS.COPIED'));
    });
  };
  return { copy };
};
