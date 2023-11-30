import { Inbox } from '@/features/chat/rooms/components';

export interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="flex h-[calc(100vh_-_90px)] overflow-hidden">
      <div className="hidden min-w-[320px] basis-1/4 sm:block">
        <Inbox />
      </div>
      <div className="flex-1 p-0 sm:p-2 sm:pl-2">{children}</div>
    </div>
  );
};

export default ChatLayout;
