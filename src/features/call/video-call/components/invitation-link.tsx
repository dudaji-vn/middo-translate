import { Button, CopyZoneClick } from '@/components/actions';
import { CopyIcon, EyeOffIcon, Link2Icon } from 'lucide-react';
import { useVideoCallStore } from '../../store/video-call.store';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

export default function InvitationLink() {
  const { t } = useTranslation('common');
  const room = useVideoCallStore((state) => state.room);
  const setShowInviteSection = useVideoCallStore(
    (state) => state.setShowInviteSection,
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl bg-primary-100 p-3 dark:bg-neutral-900',
      )}
    >
      <div className="flex items-center gap-2">
        <Link2Icon size={16} />
        <p className="font-semibold text-neutral-800 dark:text-neutral-50">
          {t('CONVERSATION.INVITATION_LINK')}
        </p>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-200">
        {t('CONVERSATION.COPY_INVITATION_LINK')}
      </p>
      <CopyZoneClick
        text={`${NEXT_PUBLIC_URL}/call/${room?._id}`}
        className="flex cursor-pointer items-center justify-center rounded-xl border border-neutral-100 bg-white p-3 dark:border-neutral-700 dark:bg-background"
      >
        <span className="flex-1 truncate font-semibold text-primary">{`${NEXT_PUBLIC_URL}/call/${room?._id}`}</span>
        <Button.Icon
          size={'xs'}
          shape={'default'}
          color={'default'}
          variant={'ghost'}
        >
          <CopyIcon />
        </Button.Icon>
      </CopyZoneClick>
      <Button
        shape={'square'}
        size={'sm'}
        startIcon={<EyeOffIcon />}
        color={'secondary'}
        className="w-full"
        onClick={() => setShowInviteSection(false)}
      >
        {t('CONVERSATION.HIDE')}
      </Button>
    </div>
  );
}
