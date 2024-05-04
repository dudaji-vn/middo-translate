import {
  textVariants,
  wrapperVariants,
} from '@/features/chat/messages/components/message-item/message-item-text.style';
import { useEffect, useState } from 'react';

import { RichTextView } from '@/components/rich-text-view';
import { messageVariants } from '@/features/chat/messages/components/message-item/variants';
import { Message } from '@/features/chat/messages/types';
import { cn } from '@/utils/cn';
import { VariantProps } from 'class-variance-authority';

export interface ContentProps extends VariantProps<typeof wrapperVariants> {
  message: Message;
  setLinks?: (links: string[]) => void;
}

export const FakeMessage = ({
  position = 'right',
  active = false,
  message,
}: ContentProps) => {
  const [contentDisplay, setContentDisplay] = useState(message.content);
  useEffect(() => {
    setContentDisplay(message.content);
    return;
  }, [message]);
  return (
    <div
      className={cn(
        messageVariants({
          sender: 'me',
        }),
        'my-1',
      )}
    >
      <div
        className={cn(
          wrapperVariants({ active, position, status: message.status }),
        )}
      >
        <div className={cn(textVariants({ position, status: message.status }))}>
          <RichTextView
            editorStyle="text-base md:text-sm"
            mentions={[]}
            mentionClassName={position === 'right' ? 'right' : 'left'}
            content={contentDisplay}
          />
        </div>
      </div>
    </div>
  );
};
