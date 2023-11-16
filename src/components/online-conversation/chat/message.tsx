import { Message as MessageType } from '@/types/room';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import moment from 'moment';

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  isMe?: boolean;
  message: MessageType;
  useTranslate?: boolean;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ isMe, message, useTranslate = false, ...props }, ref) => {
    return (
      <div className={isMe ? 'receiver' : 'sender'}>
        <div className="cMessageWrapper">
          <div className="cMessage">
            {useTranslate ? message.translatedContent : message.content}
          </div>
        </div>
      </div>
    );
  },
);
export const GroupMessage = ({
  messages,
  isMe = false,
  useTranslate = false,
}: {
  messages: MessageType[];
  isMe?: boolean;
  useTranslate?: boolean;
}) => {
  const sender = messages[0].sender;

  if (messages[0].isSystem)
    return (
      <>
        {messages.map((message, index) => (
          <div className="notiMess" key={index}>
            {message.content}
          </div>
        ))}
      </>
    );

  const bg = `bg-[${sender.color}]`;
  return (
    <div className={cn('flex w-full items-end gap-3', isMe && 'justify-end')}>
      {!isMe && (
        <div
          style={{ backgroundColor: sender.color }}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full text-background',
            bg,
          )}
        >
          {sender.username[0]}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {!isMe && <div>{messages[0].sender.username}</div>}
        {messages.map((message, index) => (
          <Message
            useTranslate={useTranslate}
            message={message}
            key={index}
            isMe={isMe}
          />
        ))}
        <div
          className={cn('text-xs font-light', isMe ? 'ml-auto pr-3' : 'pl-3')}
        >
          Sent on {moment(messages[0].createdAt).format('LT')}
        </div>
      </div>
    </div>
  );
};

Message.displayName = 'Message';
