import { textVariants, wrapperVariants } from './message-item-text.style';

import { Message } from '../../types';

import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { PhoneCall, PhoneIcon } from 'lucide-react';
import { Button } from '@/components/actions';
import { useMemo } from 'react';
import moment from 'moment';

export interface TextMessageProps extends VariantProps<typeof wrapperVariants> {
  message: Message;
}

export const CallMessage = ({
  position,
  active,
  message,
}: TextMessageProps) => {
  const { call } = message;
  const { content, icon } = useMemo((): {
    content: string;
    icon: React.ReactNode;
  } => {
    if (call?.endTime) {
      return {
        content:
          'Call end at ' +
          moment(call.endTime).format('HH:mm') +
          '. Duration: ' +
          moment
            .duration(moment(call.endTime).diff(moment(call.createdAt)))
            .humanize(),
        icon: (
          <PhoneIcon className="mr-2 inline-block h-4 w-4 rotate-[135deg]" />
        ),
      };
    }
    return {
      content: 'Started a call',
      icon: <PhoneCall className="mr-2 inline-block h-4 w-4" />,
    };
  }, [call]);
  return (
    <div
      className={cn(
        wrapperVariants({ active, position, status: message.status }),
      )}
    >
      <div>
        <span
          className={cn(textVariants({ position, status: message.status }))}
        >
          {icon}

          {content}
        </span>
      </div>
      {call?.type === 'GROUP' && !call.endTime && (
        <Button color="secondary" size="xs" className="mt-2 w-full">
          Invite
        </Button>
      )}
    </div>
  );
};
