import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import Tip from '@/components/data-display/tip/tip';
import {
  Frown,
  FrownIcon,
  PenSquareIcon,
  Search,
  Users2Icon,
} from 'lucide-react';

import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InboxType } from './inbox';
import { useAppStore } from '@/stores/app.store';
import { useSideChatStore } from '@/features/chat/stores/side-chat.store';
import ViewSpaceInboxFilter from './view-space-inbox-filter';
export interface EmptyInboxProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: InboxType | 'help-desk-filtered';
}

export const EmptyInbox = forwardRef<HTMLDivElement, EmptyInboxProps>(
  ({ type = 'all' }, ref) => {
    const setPingEmptyInbox = useAppStore((state) => state.setPingEmptyInbox);
    const translateExtension = useMemo(() => {
      switch (type) {
        case 'all':
          return '';
        case 'group':
          return '_GROUP';
        default:
          return '';
      }
    }, [type]);
    const { t } = useTranslation('common');
    const [hideTip, setHideTip] = useState(false);
    const { setCurrentSide } = useSideChatStore();
    const handleCreateGroup = () => {
      setCurrentSide('group');
    };

    useEffect(() => {
      if (type === 'all') {
        setPingEmptyInbox(true);
      }
      return () => {
        setPingEmptyInbox(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    if (type === 'help-desk-filtered') {
      return (
        <div className="relative  flex h-full w-full flex-1  flex-col items-center gap-4 overflow-hidden bg-card p-0 text-base">
          <ViewSpaceInboxFilter className={'z-[60]'} />
          <Typography
            variant="default"
            className="flex-rows mt-10 flex items-center gap-3 text-neutral-500"
          >
            <Search className="size-4 font-semibold text-neutral-800" />
            {t(`INBOX_EMPTY.NO_RESULT.TITLE`)}
          </Typography>
          <p className="my-3 text-neutral-600">
            {t(`INBOX_EMPTY.NO_RESULT.DESCRIPTION`)}
          </p>
        </div>
      );
    }
    if (type === 'help-desk') {
      return (
        <div className="mt-3 h-full bg-card px-4 text-base">
          <div className="py-6">
            <Typography
              variant="default"
              className="font-semibold text-neutral-800"
            >
              {t(`INBOX_EMPTY.NO_CLIENT.TITLE${translateExtension}`)}
            </Typography>
            <p className="my-3 text-neutral-600">
              {t(`INBOX_EMPTY.NO_CLIENT.DESCRIPTION${translateExtension}`)}
            </p>
          </div>
        </div>
      );
    }
    if (type === 'archived' || type === 'waiting') {
      return (
        <div className="mt-3 flex h-full flex-col items-center justify-center bg-card px-4 text-base">
          <FrownIcon className="-mt-10 h-12 w-12 text-neutral-400" />
          <p className="my-3 text-center font-medium text-neutral-600">
            {t(`INBOX_EMPTY.MESSAGE${translateExtension}`)}
          </p>
        </div>
      );
    }
    return (
      <div className="mt-3 h-full bg-card px-4 text-base">
        <Tip
          tipTitle={t(`INBOX_EMPTY.TIP_TITLE${translateExtension}`)}
          className="col-span-2"
          hideTip={hideTip}
          tipContent={t(`INBOX_EMPTY.TIP_DESCRIPTION${translateExtension}`)}
          closeTip={() => setHideTip(true)}
        />
        <div className="py-6">
          <Typography
            variant="default"
            className="font-semibold text-neutral-800"
          >
            {t(`INBOX_EMPTY.TITLE${translateExtension}`)}
          </Typography>
          <p className="my-3 text-neutral-600">
            {t(`INBOX_EMPTY.DESCRIPTION${translateExtension}`)}
          </p>
          {type === 'all' && (
            <ul className="ml-5 list-decimal space-y-4 text-neutral-400">
              <li className="items-center">
                <div className="flex items-center">
                  <span className="capitalize">
                    {t('COMMON.CLICK')}
                    <Button.Icon size="xs" color="default" className="mx-2">
                      <PenSquareIcon />
                    </Button.Icon>
                    {t(`INBOX_EMPTY.LIST_ITEM_1${translateExtension}`)}
                  </span>
                </div>
              </li>
              <li>{t(`INBOX_EMPTY.LIST_ITEM_2${translateExtension}`)}</li>
            </ul>
          )}
          {type === 'group' && (
            <Button
              className="mt-3 w-full"
              shape="square"
              size="md"
              onClick={handleCreateGroup}
            >
              <Users2Icon className="mr-3 h-5 w-5" />{' '}
              {t('CONVERSATION.NEW_GROUP_CHAT')}
            </Button>
          )}
        </div>
      </div>
    );
  },
);
EmptyInbox.displayName = 'EmptyInbox';
