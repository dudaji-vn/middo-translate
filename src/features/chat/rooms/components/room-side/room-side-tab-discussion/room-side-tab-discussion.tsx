import { Button } from '@/components/actions';
import Discussion from '@/features/chat/discussion/components/discussion';
import { MessageActions } from '@/features/chat/messages/components/message-actions';
import { useClickReplyMessage } from '@/features/chat/messages/hooks/use-click-reply-message';
import { SubtitlesIcon, XIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export interface RoomSideTabDiscussionProps {}

export const RoomSideTabDiscussion = (props: RoomSideTabDiscussionProps) => {
  const params = useSearchParams();
  const messageId = params?.get('ms_id') || '';
  const { onBack } = useClickReplyMessage();
  console.log('messageId', messageId);

  return (
    <MessageActions>
      <div className="-m-3 my-0 flex h-full flex-col">
        <div className="-mt-3 flex h-[53px] w-full items-center gap-2 border-b p-3 font-semibold text-primary">
          <SubtitlesIcon className="size-4" />
          <span>Discussion</span>
          <div className="ml-auto">
            <Button.Icon
              onClick={onBack}
              size="sm"
              variant="ghost"
              color="default"
            >
              <XIcon />
            </Button.Icon>
          </div>
        </div>
        <Discussion messageId={messageId} />
      </div>
    </MessageActions>
  );
};
