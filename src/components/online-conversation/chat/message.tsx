'use client';

import { forwardRef, useEffect, useState } from 'react';

import { Message as MessageType } from '@/types/room';
import { Text } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { cn } from '@/utils/cn';
import moment from 'moment';

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  isMe?: boolean;
  message: MessageType;
  useTranslate?: boolean;
  isShowFull?: boolean;
  alwaysShowTime?: boolean;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      isMe,
      message,
      useTranslate = false,
      isShowFull = false,
      alwaysShowTime = false,
      ...props
    },
    ref,
  ) => {
    const [isShowTime, setIsShowTime] = useState(alwaysShowTime);
    useEffect(() => {
      setIsShowTime(alwaysShowTime);
    }, [alwaysShowTime]);

    return (
      <>
        <div
          onClick={() => {
            if (alwaysShowTime) return;
            setIsShowTime(!isShowTime);
          }}
          className={cn('cursor-pointer', isMe ? 'receiver' : 'sender')}
        >
          <div className="cMessageWrapper">
            <div className="cMessage">
              <Text
                value={
                  useTranslate
                    ? message.translatedContent || ''
                    : message.content
                }
              />
              {isShowFull && message.englishContent && (
                <div className="relative mt-2">
                  <TriangleSmall
                    fill="white"
                    position="top"
                    className="absolute left-2 top-0 -translate-y-full"
                  />
                  <div className="mt-2 rounded-lg bg-background p-1 px-2">
                    <Text
                      value={message.englishContent}
                      className="text-sm font-light italic"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {isShowTime && (
          <div
            className={cn('text-xs font-light', isMe ? 'ml-auto pr-3' : 'pl-3')}
          >
            Sent on {moment(message.createdAt).format('LT')}
          </div>
        )}
      </>
    );
  },
);
export const GroupMessage = ({
  messages,
  isMe = false,
  useTranslate = false,
  isShowFull = false,
  isLast = false,
}: {
  messages: MessageType[];
  isMe?: boolean;
  useTranslate?: boolean;
  isShowFull?: boolean;
  isLast?: boolean;
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
    <div
      className={cn('mt-5 flex w-full items-end gap-3 ', isMe && 'justify-end')}
    >
      {!isMe && (
        <div
          style={{ backgroundColor: sender.color }}
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-background',
            bg,
          )}
        >
          {sender.username[0]}
        </div>
      )}
      <div className="flex max-w-[90%] flex-col gap-2">
        {!isMe && (
          <div className="text-sm font-light">
            {messages[0].sender.username}
          </div>
        )}
        {messages.map((message, index) => (
          <Message
            isShowFull={isShowFull}
            useTranslate={useTranslate}
            message={message}
            key={index}
            isMe={isMe}
            alwaysShowTime={isLast && index === messages.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

Message.displayName = 'Message';
