'use client';

import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { Plus } from 'lucide-react';
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
import { User } from '@/features/users/types';
import { useAuthStore } from '@/stores/auth.store';
import { useGetSpaces } from '@/features/business-spaces/hooks/use-get-spaces';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Member } from '../spaces-crud/sections/members-columns';
import { useGetMyBusinessNotifications } from '@/features/business-spaces/hooks/use-get-notification';
import SpacesNotifications from './business-notifications/spaces-notifications';

export type BusinessTabType = 'all_spaces' | 'my_spaces' | 'joined_spaces';
export type BusinessTabItem = {
  value: BusinessTabType;
  label: string;
  componentProps?: Partial<TabsContentProps>;
};
export type TSpaceTag = 'my' | 'joined' | undefined;
export type TConversationTag = {
  _id: string;
  name: string;
  color: string;
  isReadonly?: boolean;
};
export type TSpace = BaseEntity & {
  name: string;
  avatar?: string;
  backgroundImage?: string;
  description?: string;
  members: Member[];
  newMessagesCount: number;
  owner: User;
  tag?: TSpaceTag;
  tags: TConversationTag[];
};
const tabItems: BusinessTabItem[] = [
  {
    value: 'all_spaces',
    label: 'All spaces',
    componentProps: {
      className: '',
    },
  },
  {
    value: 'my_spaces',
    label: 'My spaces',
  },
  {
    value: 'joined_spaces',
    label: 'Joined spaces',
  },
];
const BusinessSpaces = () => {
  const [tab, setTab] = React.useState<BusinessTabType>('all_spaces');
  const { data: invitations } = useGetMyBusinessNotifications();
  const currentUser = useAuthStore((s) => s.user);
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
            'flex w-full flex-row items-end justify-between bg-primary-100 px-[5vw] py-5',
          )}
        >
          <div className="flex flex-row gap-3">
            <Avatar
              src={currentUser?.avatar ?? '/avatar.svg'}
              alt="avt"
              className="h-16 w-16"
            />
            <div className="flex flex-col gap-2">
              <Typography className="text-base font-normal leading-[18px] text-neutral-600">
                Hi, welcome back
              </Typography>
              <Typography className="text-base font-semibold text-primary-500-main">
                {currentUser?.name}
              </Typography>
            </div>
          </div>
          <div className="flex h-fit flex-row items-center gap-3">
            <Button
              variant={'default'}
              startIcon={<Plus className="h-4 w-4" />}
              color={'primary'}
              shape={'square'}
              className={'w-fit'}
              onClick={() => {
                router.push(ROUTE_NAMES.SPACES + '?modal=create-space');
              }}
              size={'xs'}
            >
              Create New Space
            </Button>
            <SpacesNotifications invitations={invitations} />
          </div>
        </div>
        <Tabs
          defaultValue="joined_spaces"
          className="h-fit w-full "
          value={tab}
          onValueChange={(val) => setTab(val as BusinessTabType)}
        >
          <TabsList className="h-fit justify-start px-[5vw] max-md:overflow-x-auto">
            {tabItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="max-w-fit px-8"
              >
                {item.label}
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
