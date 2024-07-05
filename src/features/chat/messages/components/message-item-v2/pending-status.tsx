import { SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
export interface PendingStatusProps {}

export const PendingStatus = (props: PendingStatusProps) => {
  const { t } = useTranslation('common');
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center justify-end gap-1 text-end text-xs text-neutral-300"
    >
      <SendIcon height={12} width={12} />
      {t('CONVERSATION.SENDING')}
    </motion.div>
  );
};
