import React, { useEffect, useState } from 'react';
import { useParticipantVideoCallStore } from '../../store/participant.store';
import { CALL_TYPE } from '../../constant/call-type';
import { useVideoCallStore } from '../../store/video-call.store';
import { Lightbulb, UserPlus2Icon, X } from 'lucide-react';
import { Button } from '@/components/actions';
import { useTranslation } from 'react-i18next';

export default function InviteTooltip() {
  const { t } = useTranslation('common');

  const participants = useParticipantVideoCallStore(state => state.participants);
  const room = useVideoCallStore(state => state.room);
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const setModalAddUser = useVideoCallStore(state => state.setModalAddUser);
  
  const [isShowInvite, setShowInvite] = useState(true);
  
  useEffect(() => {
    let numParticipant = participants.length;
    if (numParticipant > 1 && isShowInvite) setShowInvite(false);
  }, [isShowInvite, participants.length]);

  return (
    <>
      {participants.length == 1 &&
        room?.type === CALL_TYPE.GROUP &&
        isShowInvite &&
        isFullScreen && (
          <div className="absolute bottom-full left-0 right-0 flex h-[300px] flex-col bg-gradient-to-t from-black/80 px-3 py-5  md:hidden">
            <div className="mt-auto rounded-xl bg-neutral-50 p-2">
              <div className="flex items-center text-neutral-600">
                <Lightbulb className="h-4 w-4 text-neutral-400" />
                <p className="ml-1 flex-1">{t('CONVERSATION.NOTICE')}</p>
                <X
                  className="h-4 w-4 cursor-pointer text-neutral-400"
                  onClick={() => setShowInvite(false)}
                />
              </div>
              <p className="mt-2 text-sm font-light text-neutral-400">
                {t('CONVERSATION.NOTICE_CONTENT')}
              </p>
            </div>
            <Button
              onClick={() => setModalAddUser(true)}
              size="sm"
              color="primary"
              variant="default"
              className="mx-auto mt-2 block"
              shape="square"
              startIcon={<UserPlus2Icon />}
            >
              {t('CONVERSATION.INVITE')}
            </Button>
          </div>
        )}
    </>
  );
}
