import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Lightbulb, MessageSquareQuote, X, XIcon } from 'lucide-react';
import { Button } from '@/components/actions';
import { getMessageIdFromCallIdService } from '@/services/message.service';
import dynamic from 'next/dynamic';
const Discussion = dynamic(() => import('@/features/chat/discussion/components/discussion'));
import { useAppStore } from '@/stores/app.store';
import { useVideoCallStore } from '../../store/video-call.store';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useTranslation } from 'react-i18next';
import Tip from '@/components/data-display/tip/tip';
import InvitationLink from './invitation-link';
import { CALL_TYPE } from '../../constant/call-type';

export default function ChatThread({ className }: { className?: string }) {

  const {t} = useTranslation('common')

  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);
  const isShowChat = useVideoCallStore((state) => state.isShowChat);
  const setShowChat = useVideoCallStore((state) => state.setShowChat);
  const call = useVideoCallStore((state) => state.call);
  const messageId = useVideoCallStore((state) => state.messageId);
  const setMessageId = useVideoCallStore((state) => state.setMessageId);
  const isMobile = useAppStore((state) => state.isMobile);
  const [isShowAlert, setShowAlert] = useState(true);
  const isShowInviteSection = useVideoCallStore(state => state.isShowInviteSection)

  useEffect(() => {
    if (messageId) return;
    const callId = call?._id;
    if (!callId) return;
    const handleGetMessageId = async () => {
      const { data } = await getMessageIdFromCallIdService(callId);
      setMessageId(data);
    };
    handleGetMessageId();
  }, [call, messageId, setMessageId]);
  if (!messageId) return null;
  return (
    <aside
      className={twMerge(
        'z-20 h-full w-full flex-1 overflow-y-hidden border-t bg-background md:overflow-auto md:border-t-0',
        className,
        isMobile && 'fixed top-[52px] h-[calc(100dvh_-_104px)]',
        (!isFullScreen || !isShowChat) && 'hidden md:hidden',
      )}
    >
      <div className="flex h-full w-full flex-col border-l border-neutral-50 dark:border-neutral-900">
        <div className="flex h-[53px] w-full items-center gap-2 border-b p-3 font-semibold text-primary">
          <MessageSquareQuote className="size-4" />
          <span>{t('CONVERSATION.DISCUSSION')}</span>
          <div className="ml-auto">
            <Tooltip
              title={t('TOOL_TIP.CLOSE_DISCUSSION')}
              triggerItem={
                <Button.Icon
                  onClick={() => setShowChat(false)}
                  size="xs"
                  variant="ghost"
                  color="default"
                >
                  <XIcon />
                </Button.Icon>
              }
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
        <Tip hideTip={!isShowAlert} 
          closeTip={()=>setShowAlert(false)} 
          tipTitle={call?.type == CALL_TYPE.ANONYMOUS ? t('CONVERSATION.TITLE_DISCUSSION_INSTANCE_CALL') : t('CONVERSATION.TITLE_DISCUSSION_CALL')} 
          tipContent={call?.type == CALL_TYPE.ANONYMOUS ? t('CONVERSATION.CONTENT_DISCUSSION_INSTANCE_CALL') : t('CONVERSATION.CONTENT_DISCUSSION_CALL')}
          className='p-3' />
          {call?.type == CALL_TYPE.ANONYMOUS && isShowInviteSection && <div className='p-3'>
            <InvitationLink />
          </div>}
          <div className="flex-1 overflow-hidden">
            <div className="h-full">
              <Discussion messageId={messageId}/>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
