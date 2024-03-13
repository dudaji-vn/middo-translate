import { Button } from '@/components/actions';
import dynamic from 'next/dynamic';
const Discussion = dynamic(() => import('@/features/chat/discussion/components/discussion'));
import { useClickReplyMessage } from '@/features/chat/messages/hooks/use-click-reply-message';
import {
  MessageSquare,
  MessageSquareQuote,
  SubtitlesIcon,
  XIcon,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { RoomSideTabLayout } from '../room-side-tabs/room-side-tab-layout';

export interface RoomSideTabDiscussionProps {}

export const RoomSideTabDiscussion = (props: RoomSideTabDiscussionProps) => {
  const params = useSearchParams();
  const messageId = params?.get('ms_id') || '';
  const { onBack } = useClickReplyMessage();
  return (
    <RoomSideTabLayout
      title="Discussion"
      icon={<MessageSquareQuote />}
      onBack={onBack}
    >
      <Discussion messageId={messageId} />
    </RoomSideTabLayout>
  );
};
