import { Message } from '../../types';

export interface MessageItemSystemProps {
  message: Message;
  isMe?: boolean;
}

export const MessageItemSystem = ({
  message,
  isMe,
}: MessageItemSystemProps) => {
  return (
    <div className="mx-auto">
      <span className="text-sm font-light text-colors-neutral-500">
        {isMe ? 'You' : message.sender.name}
        {' ' + message.content}

        {message.targetUsers?.map((user, index) => {
          return index === 0 ? ' ' + user.name : ', ' + user.name;
        })}
      </span>
    </div>
  );
};
