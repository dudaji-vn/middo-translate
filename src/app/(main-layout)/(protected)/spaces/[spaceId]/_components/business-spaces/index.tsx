'use client';

import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { Blocks, Key, Plus, User as UserIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/navigation';

import React, { useMemo } from 'react';
import SpacesList from './tabs-content/spaces-list';
import { TabsContentProps } from '@radix-ui/react-tabs';
import { BaseEntity } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { useGetSpaces } from '@/features/business-spaces/hooks/use-get-spaces';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Member } from '../spaces-crud/sections/members-columns';
import SpacesNotifications from './business-notifications/spaces-notifications';
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service';
import { useTranslation } from 'react-i18next';
import { type User } from '@/features/users/types';

export type BusinessTabType = 'all_spaces' | 'my_spaces' | 'joined_spaces';
export type BusinessTabItem = {
  value: BusinessTabType;
  label: string;
  componentProps?: Partial<TabsContentProps>;
  icon?: React.ReactNode;
};
export type TSpaceTag = 'my' | 'joined' | undefined;
export type TConversationTag = {
  _id: string;
  name: string;
  isDeleted?: boolean;
  color: string;
  isReadonly?: boolean;
};
export type TSpace = BaseEntity & {
  name: string;
  avatar?: string;
  backgroundImage?: string;
  description?: string;
  members: Member[];
  totalNewMessages: number;
  owner: User;
  tag?: TSpaceTag;
  tags: TConversationTag[];
  extension?: TBusinessExtensionData;
  countries?: string[];
  bot?: string;
};

const tabItems: BusinessTabItem[] = [
  {
    value: 'all_spaces',
    label: 'ALL_SPACE',
    icon: <Blocks />,
    componentProps: {
      className: '',
    },
  },
  {
    value: 'my_spaces',
    label: 'MY_SPACE',
    icon: <Key />,
  },
  {
    value: 'joined_spaces',
    label: 'JOINED_SPACE',
    icon: <UserIcon />,
  },
];
const BusinessSpaces = () => {
  const [tab, setTab] = React.useState<BusinessTabType>('all_spaces');
  const currentUser = useAuthStore((s) => s.user);
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();

  const { data: spaces_list, isLoading } = useGetSpaces({
    type: tab,
  });
  const modal = useMemo(() => {
    const modal = searchParams?.get('modal');
    if (modal === 'create-space') return modal;
    return null;
  }, [searchParams]);

  const router = useRouter();
  return (
    <>
      <section className={modal ? 'hidden' : ''}>
        <div
          className={cn(
            'flex w-full flex-col justify-between gap-4  bg-primary-100 px-[5vw] py-5 dark:bg-background sm:gap-1 md:flex-row md:items-end',
          )}
        >
          <div className="flex w-full flex-row gap-3">
            <Avatar
              src={currentUser?.avatar ?? '/avatar.svg'}
              alt="avt"
              className="h-16 w-16"
              variant={'outline'}
            />
            <div className="flex w-full flex-col gap-2">
              <Typography className="min-w-fit text-base font-normal leading-[18px] text-neutral-600 dark:text-neutral-50">
                {t('EXTENSION.SPACE.WELCOME')}
              </Typography>
              <Typography className="text-base font-semibold text-primary-500-main">
                {currentUser?.name}
              </Typography>
            </div>
          </div>
          <div className="flex h-fit w-full flex-row items-center justify-stretch gap-3 sm:justify-end">
            <Button
              variant={'default'}
              startIcon={<Plus className="h-4 w-4" />}
              color={'primary'}
              shape={'square'}
              className={'w-full sm:w-fit'}
              onClick={() => {
                router.push(ROUTE_NAMES.SPACES + '?modal=create-space');
              }}
              size={'xs'}
            >
              {t('EXTENSION.SPACE.CREATE_SPACE')}
            </Button>
            <SpacesNotifications />
          </div>
        </div>
        <Tabs
          defaultValue="joined_spaces"
          className="h-fit w-full "
          value={tab}
          onValueChange={(val) => setTab(val as BusinessTabType)}
        >
          <TabsList className="flex h-fit w-full flex-row items-center justify-between px-[5vw] max-md:gap-0 md:justify-start">
            {tabItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="flex max-w-fit flex-row items-center gap-2 px-7 dark:text-neutral-50 max-md:w-full max-md:flex-1 sm:px-9 md:px-8"
              >
                <span
                  className={cn({
                    'max-sm:!hidden': item.value === tab,
                  })}
                >
                  {item.icon}
                </span>
                <p
                  className={cn({
                    'max-md:hidden': item.value !== tab,
                  })}
                >
                  {t(`EXTENSION.SPACE.${item.label}`)}
                </p>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabItems.map((item) => (
            <TabsContent
              key={item.value}
              value={item.value}
              {...item.componentProps}
              className={cn(
                'overflow-h-auto data-[state=active]:h-[calc(100vh-240px)] data-[state=active]:min-h-[400px]',
                item.componentProps?.className,
              )}
            >
              <SpacesList
                tab={item.value}
                spaces={spaces_list}
                loading={isLoading}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </>
  );
};

export default BusinessSpaces;
