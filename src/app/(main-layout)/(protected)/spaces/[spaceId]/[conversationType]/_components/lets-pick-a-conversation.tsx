'use client';

import { MessageBubbleIcon } from '@/components/icons';
import { Typography } from '@/components/data-display';
import { useTranslation } from 'react-i18next';

export default function LetsPickAConversation() {
  const { t } = useTranslation('common');

  return (
    <main className="bw-full flex h-full flex-col items-center justify-center rounded-md bg-card max-md:hidden">
      <div className="flex flex-col items-center justify-center">
        <MessageBubbleIcon />
        <Typography variant="muted" className="text-center text-lg">
          {t('CONVERSATION.PICK_MESSAGE')}
        </Typography>
      </div>
    </main>
  );
}
