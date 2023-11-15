import { forwardRef, useMemo } from 'react';

import { Message as MessageType } from '@/types/room';
import { cn } from '@/utils/cn';
import moment from 'moment';

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  isMe?: boolean;
  message: MessageType;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ isMe, message, ...props }, ref) => {
    return (
      <div className={isMe ? 'receiver' : 'sender'}>
        <div className="cMessageWrapper">
          <div className="cMessage">{message.content}</div>
        </div>
      </div>
    );
  },
);
export const GroupMessage = ({
  messages,
  isMe = false,
}: {
  messages: MessageType[];
  isMe?: boolean;
}) => {
  const { firstLetter, randomColor } = useMemo(() => {
    const colors = [
      'bg-[#d47500]',
      'bg-[#05aa55]',
      'bg-[#e3pc01]',
      'bg-[#01a0d3]',
      'bg-[#b281b3]',
      'bg-[#dc2929]',
      'bg-primary',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return {
      firstLetter: messages[0].sender.username[0],
      randomColor,
    };
  }, [messages]);

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

  return (
    <div className={cn('flex w-full items-end gap-3', isMe && 'justify-end')}>
      {!isMe && (
        <div
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full text-background',
            randomColor,
          )}
        >
          {firstLetter}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {!isMe && <div>{messages[0].sender.username}</div>}
        {messages.map((message, index) => (
          <Message message={message} key={index} isMe={isMe} />
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
