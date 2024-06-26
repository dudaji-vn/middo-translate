import { textVariants, wrapperVariants } from './message-item-text.style';

import { Message } from '../../types';

import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { PhoneCall, PhoneIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import 'moment-precise-range-plugin';
import { convertToTimeReadable } from '@/utils/time';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useTranslation } from 'react-i18next';

export interface TextMessageProps extends VariantProps<typeof wrapperVariants> {
  message: Message;
}

export const CallMessage = ({
  position,
  active,
  message,
}: TextMessageProps) => {
  const { call: _call } = message;
  const [call, setCall] = useState(_call);
  const {t} = useTranslation('common')
  const { content, icon, subContent } = useMemo((): {
    content: string;
    icon: React.ReactNode;
    subContent?: string;
  } => {
    if (call?.endTime) {

      return {
        content: t('CONVERSATION.CALL_END_AT', {time: moment(call.endTime).format('HH:mm')}),
        subContent: convertToTimeReadable(
          call.startTime || call.endTime,
          call.endTime,
        ) || '0s',
        icon: (
          <PhoneIcon className="mr-2 inline-block h-4 w-4 rotate-[135deg]" />
        ),
      };
    }
    return {
      content: t('CONVERSATION.STARTED_CALL'),
      icon: <PhoneCall className="mr-2 inline-block h-4 w-4" />,
    };
  }, [call, t]);
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.CALL.UPDATE, (call) => {
      if (call._id === _call?._id) {
        setCall(call);
      }
    });
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.UPDATE);
    };
  }, [_call?._id]);
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
          <div className="mt-1 text-sm font-light opacity-70">{subContent}</div>
        </span>
      </div>
    </div>
  );
};
