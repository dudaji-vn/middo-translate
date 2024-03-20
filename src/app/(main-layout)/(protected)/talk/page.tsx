"use client"
import { MessageBubbleIcon } from '@/components/icons';
import { Typography } from '@/components/data-display';
import { useTranslation } from 'react-i18next';

export default function ChatPage() {
  const {t} = useTranslation('common');
  return (
    <main className="flex h-full w-full flex-col items-center justify-center rounded-md bg-card">
      <div className="flex flex-col items-center justify-center">
        <MessageBubbleIcon />
        <Typography variant="muted" className="text-center text-lg">
          {t('CONVERSATION.PICK_MESSAGE')}
        </Typography>
      </div>
    </main>
  );
}
