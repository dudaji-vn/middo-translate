import { Message } from '../../types';
import { Text } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { cn } from '@/utils/cn';

export interface TextMessageProps {
  isMe: boolean;
  message: Message;
}

export const TextMessage = ({ isMe, message }: TextMessageProps) => {
  return (
    <div
      className={cn(
        'p-4',
        isMe ? 'bg-primary' : 'bg-colors-neutral-50',
        message.status === 'removed' && 'bg-transparent',
      )}
    >
      <span
        className={cn(
          'break-word-mt',
          isMe && 'text-background',
          message.status === 'removed' && 'text-neutral-300',
        )}
      >
        {message.content}
      </span>
      <div className="relative mt-2">
        <TriangleSmall
          fill={isMe ? '#72a5e9' : '#e6e6e6'}
          position="top"
          className="absolute left-4 top-0 -translate-y-full"
        />
        <div
          className={cn(
            'mt-2 rounded-xl  p-3',
            isMe
              ? 'bg-colors-primary-400 text-background'
              : 'bg-colors-neutral-100 text-colors-neutral-600',
          )}
        >
          <Text value="English text here" className="text-sm font-light " />
        </div>
      </div>
    </div>
  );
};
