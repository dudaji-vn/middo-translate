import { SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface PendingStatusProps {}

export const PendingStatus = (props: PendingStatusProps) => {
  const {t} = useTranslation('common');
  return (
    <div className="flex items-center justify-end gap-1 text-end text-sm text-text">
      <SendIcon height={12} width={12} />
      {t('CONVERSATION.SENDING')}
    </div>
  );
};
