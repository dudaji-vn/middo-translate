'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { cva } from 'class-variance-authority';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/navigation';

import React from 'react';
import BusinessExtension from '../extenstion/business-extension';
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service';
import { ROUTE_NAMES } from '@/configs/route-name';
import { TSpace } from '../../../_components/business-spaces';
import MembersList from '../members-list/members-list';
import { EditSpaceModal } from '../space-edition/edit-space-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import EditSpaceImage from '../space-edition/edit-space-image';
import { DeleteSpaceModal } from '../space-edition/delete-space-modal';
import TagsList from '../tags-list/tags-list';
import { useAuthStore } from '@/stores/auth.store';
import { ESPaceRoles, SPACE_SETTING_TAB_ROLES } from './setting-items';
import { getUserSpaceRole } from './role.util';
import { useTranslation } from 'react-i18next';

export enum ESettingTabs {
  'MEMBERS' = 'members',
  'EXTENSION' = 'extension',
  'TAGS' = 'tags',
}
export type ExtensionModalType = 'edit-extension' | 'create-extension';
const headerVariants = cva('w-full flex flex-row', {
  variants: {
    modal: {
      'edit-extension': 'hidden',
      'create-extension': ' hidden',
      'edit-company': 'hidden',
    },
  },
});
const editSpaceSchema = z.object({
  spaceId: z.string().min(1, {
    message: 'Space ID is required.',
  }),
  name: z
    .string()
    .min(1, {
      message: 'Space name is required.',
    })
    .max(30, {
      message: 'Space name is too long, maximum 30 characters.',
    }),
  avatar: z.string().min(1, {
    message: 'Space avatar is required.',
  }),
  tags: z.array(z.string()).optional(),
  backgroundImage: z.string().optional(),
});

export type TEditSpaceFormValues = z.infer<typeof editSpaceSchema>;
type SpaceSettingProps = {
  defaultTab?: ESettingTabs;
  space: {
    extension: TBusinessExtensionData;
  } & TSpace;
};

const SETTINGS_VIEW_ROLES = [ESPaceRoles.Admin, ESPaceRoles.Owner];

const SpaceSetting = ({
  space,
  defaultTab = ESettingTabs.MEMBERS,
}: SpaceSettingProps) => {
  const searchParams = useSearchParams();
  const params = useParams();
  const { t } = useTranslation('common');
  const currentUser = useAuthStore((state) => state.user);
  const currentUserRole = getUserSpaceRole(currentUser, space);
  const modalType: ExtensionModalType = searchParams?.get(
    'modal',
  ) as ExtensionModalType;
  const isExtensionEmpty = !space?.extension;
  const isSpaceOwner =
    Boolean(currentUser?._id) && currentUser?._id === space?.owner?._id;

  const formEditSpace = useForm<TEditSpaceFormValues>({
    mode: 'onChange',
    defaultValues: {
      spaceId: params?.spaceId as string,
      name: space?.name || '',
      avatar: space?.avatar || '/avatar.svg',
      backgroundImage: space?.backgroundImage,
    },
    resolver: zodResolver(editSpaceSchema),
  });

  if (!currentUserRole || SETTINGS_VIEW_ROLES.indexOf(currentUserRole) === -1) {
    return null;
  }

  if (!space) {
    return null;
  }

  return (
    <>
      <section
        className={
          modalType ? 'hidden' : 'h-fit w-full bg-white dark:bg-background px-3 py-5 md:px-10'
        }
      >
        <Form {...formEditSpace}>
          <div className="flex w-full flex-row items-center justify-between rounded-[12px] bg-primary-100 dark:bg-neutral-900 p-3">
            <div
              className={cn(
                'flex w-full flex-row items-center gap-3',
                headerVariants({ modal: modalType }),
              )}
            >
              <EditSpaceImage uploadAble={isSpaceOwner} />
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <Typography className="text-[18px]  font-semibold  leading-5 text-neutral-800 dark:text-neutral-50">
                    {space?.name}
                  </Typography>
                  {isSpaceOwner && <EditSpaceModal space={space} />}
                </div>
                <Typography className="text-sm font-normal leading-[18px] text-neutral-400">
                  {space?.members?.length || 0}&nbsp;
                  {t('COMMON.MEMBER')}
                </Typography>
              </div>
            </div>
            {isSpaceOwner && <DeleteSpaceModal space={space} />}
          </div>
        </Form>
      </section>
      <section
        className={modalType ? 'hidden' : 'w-full items-center bg-white dark:bg-background'}
      >
        <Tabs defaultValue={defaultTab} className="m-0 w-full p-0">
          <div className="w-full overflow-x-auto bg-white dark:bg-background transition-all duration-300">
            <TabsList className="flex w-full  flex-row justify-start sm:px-10">
              {SPACE_SETTING_TAB_ROLES.map((item) => {
                return (
                  <TabsTrigger
                    key={item.label}
                    value={item.name}
                    className={cn('w-fit lg:px-10 dark:text-neutral-200', {
                      hidden:
                        !currentUserRole ||
                        !item.roles.view.find(
                          (role) => role === currentUserRole,
                        ),
                    })}

                  >
                    {t(item.label)}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          <TabsContent
            value={ESettingTabs.MEMBERS}
            className={cn('py-4', {
              hidden:
                !currentUserRole ||
                !SPACE_SETTING_TAB_ROLES.find(
                  (item) => item.name === 'members',
                )?.roles.view.find((role) => role === currentUserRole),
            })}
          >
            <MembersList  />
          </TabsContent>
          <TabsContent
            value={ESettingTabs.TAGS}
            className={cn('py-4', {
              hidden:
                !currentUserRole ||
                !SPACE_SETTING_TAB_ROLES.find(
                  (item) => item.name === 'tags',
                )?.roles.view.find((role) => role === currentUserRole),
            })}
          >
            <TagsList
              tags={space.tags}
              spaceId={space._id}
              myRole={currentUserRole}
            />
          </TabsContent>
          <TabsContent
            value={ESettingTabs.EXTENSION}
            className={cn(
              'flex w-full flex-col items-center justify-center p-10',
              {
                hidden:
                  !currentUserRole ||
                  !SPACE_SETTING_TAB_ROLES.find(
                    (item) => item.name === 'extension',
                  )?.roles.view.find((role) => role === currentUserRole),
              },
            )}
          >
            <div
              className={
                isExtensionEmpty
                  ? 'flex min-h-[calc(100vh-350px)] w-full  flex-col items-center justify-center gap-2'
                  : 'hidden'
              }
            >
              <Image
                src="/empty_extension.svg"
                width={200}
                height={156}
                alt="empty-extensions"
                className="mx-auto"
              />
              <Typography className="text-lg font-semibold leading-5 text-neutral-800 dark:text-neutral-50">
                Your extension is almost here!
              </Typography>
              <Typography className="text-neutral-600 dark:text-neutral-200">
                Create a conversation extension with the help of ready-made
                theme or define a unique one on your own
              </Typography>
              <div
                className={cn({
                  hidden: !isSpaceOwner,
                })}
              >
                <Link
                  href={`${ROUTE_NAMES.SPACES}/${params?.spaceId}/settings?modal=create-extension`}
                  className={isExtensionEmpty ? '' : 'hidden'}
                >
                  <Button
                    variant={'default'}
                    color={'primary'}
                    shape={'square'}
                    className={'mx-auto mt-4 w-fit'}
                  >
                    <Plus className="h-4 w-4" />
                    <Typography className="ml-2 text-white">
                      Create Extension
                    </Typography>
                  </Button>
                </Link>
              </div>
            </div>
            <BusinessExtension
              data={space.extension}
              name="Middo Conversation Extension"
              myRole={currentUserRole}
            />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default SpaceSetting;
