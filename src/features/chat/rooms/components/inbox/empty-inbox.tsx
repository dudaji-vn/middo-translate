import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import Tip from '@/components/data-display/tip/tip';
import { PenSquareIcon, Users2Icon } from 'lucide-react';

import { forwardRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InboxType } from './inbox';
import { useSidebarTabs } from '@/features/chat/hooks';
export interface EmptyInboxProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: InboxType;
}

export const EmptyInbox = forwardRef<HTMLDivElement, EmptyInboxProps>(
  ({ type = 'all' }, ref) => {
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
    const { changeSide } = useSidebarTabs();
    const handleCreateGroup = () => {
      changeSide('group');
    };
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
          <Typography variant="default">
            {t(`INBOX_EMPTY.TITLE${translateExtension}`)}
          </Typography>
          <p className="my-3 text-neutral-600">
            {t(`INBOX_EMPTY.DESCRIPTION${translateExtension}`)}
          </p>
          {type === 'all' && (
            <ul className="ml-5 list-decimal text-neutral-600">
              <li className="items-center">
                <div className="flex items-center">
                  <span className="capitalize"> {t('COMMON.CLICK')} </span>
                  <Button.Icon size="xs" color="default" className="mx-2">
                    <PenSquareIcon />
                  </Button.Icon>
                  {t(`INBOX_EMPTY.LIST_ITEM_1${translateExtension}`)}
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
