import { MessageBubbleIcon } from '@/components/icons';
import { Typography } from '@/components/data-display';

export default function ChatPage() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center rounded-md bg-card">
      <div className="flex flex-col items-center justify-center">
        <MessageBubbleIcon />
        <Typography variant="muted" className="text-center text-lg">
          Pick a message to start
        </Typography>
      </div>
    </main>
  );
}
