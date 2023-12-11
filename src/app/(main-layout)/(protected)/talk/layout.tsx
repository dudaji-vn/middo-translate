import { Inbox } from '@/features/chat/rooms/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talk',
};
export interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="flex h-[calc(100vh_-_90px)] overflow-hidden">
      <div className="hidden min-w-[320px] basis-1/4 sm:block">
        <Inbox />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default ChatLayout;
