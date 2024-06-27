import { cn } from '@/utils/cn';
import { Message } from '../../types';
import { useAuthStore } from '@/stores/auth.store';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBusinessNavigationData } from '@/hooks';

export interface MessageItemParticipantJoinCallProps {
  message: Message;
  isMe: boolean;
}

export const MessageItemParticipantJoinCall = ({
  message,
  isMe,
}: MessageItemParticipantJoinCallProps) => {
  const user = useAuthStore((state) => state.user);
  const { isBusiness } = useBusinessNavigationData();
  const { t } = useTranslation('common');
  const participants = message?.call?.participants?.filter(
    (participant) => participant.status !== 'anonymous',
  );
  const participantsList = useMemo(() => {
    const members: string[] = [];
    const isHaveMe = participants?.some(
      (participant) => participant._id === user?._id,
    );
    if (isHaveMe) {
      members.push(t('CONVERSATION.YOU'));
    }
    participants?.forEach((participant) => {
      if (participant._id !== user?._id) {
        members.push(participant.name);
      }
    });
    if (members.length > 1) {
      const lastMember = members.pop();
      return `${members.join(', ')} ${t('COMMON.AND')} ${lastMember}`;
    }

    return members.join(', ');
  }, [participants, user, t]);
  if (!message || message.type !== 'call' || !message?.call?.participants) return null; // if not call message
  if (participants?.length === 0) return null; // if no participants
  if (!user || user?.status == 'anonymous') return null; // help desk user
  if (!isBusiness) return null; // if not business page
  return (
    <>
      {participantsList && (
        <span
          className={cn(
            'mt-1  block text-xs font-light text-neutral-500 dark:text-neutral-200',
            isMe ? 'text-end' : 'pl-7 text-start',
          )}
        >
          <span className="font-medium">{participantsList}</span>{' '}
          {t('COMMON.JOINED')}
        </span>
      )}
    </>
  );
};
