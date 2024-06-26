'use client';
import { Button } from '@/components/actions';
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconWrapper,
  Typography,
} from '@/components/data-display';
import { ROUTE_NAMES } from '@/configs/route-name';
import { UserItem } from '@/features/users/components';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { MoreVerticalIcon, Users2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useGetStation } from '../hooks/use-get-station';
import { Station } from '../types/station.types';
import { MoreMenu } from './more-menu';
import { StationActions } from './station-actions';
import { StationLeave } from './station-leave';

export interface SettingTabProps {}

export const SettingTab = (props: SettingTabProps) => {
  const userId = useAuthStore((state) => state.user?._id);
  const { t } = useTranslation('common');
  const params = useParams<{ stationId: string }>();
  const { data } = useGetStation({ stationId: params?.stationId! });
  const isAdmin = data?.owner?._id === userId;
  if (!data) return null;
  return (
    <StationActions>
      <div
        className={cn(
          'relative flex h-full w-full flex-1 flex-col overflow-hidden',
        )}
      >
        <StationCard station={data} />
        <div className="flex-1">
          <div className=" bg-white pb-3 dark:bg-background">
            <div className="flex items-center justify-between gap-2.5  p-3 pl-3">
              <div className="flex items-center gap-2">
                <IconWrapper>
                  <Users2 />
                </IconWrapper>
                <span>{t('CONVERSATION.MEMBERS')}</span>
                <span className="text-sm text-neutral-600">
                  ({data.members?.length})
                </span>
              </div>
              {/* <RoomAddMember /> */}
            </div>
            <div>
              {data.members?.map((member) => {
                const user = member.user;
                const isCurrentUser = user._id === userId;
                let subContent =
                  user._id === data.owner?._id
                    ? t('CONVERSATION.ADMIN')
                    : t('CONVERSATION.MEMBERS');

                if (isCurrentUser) subContent += ` (${t('CONVERSATION.YOU')})`;

                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <UserItem
                      wrapperClassName="hover:!bg-background flex-1 cursor-default"
                      subContent={subContent}
                      key={user._id}
                      user={user}
                      rightElement={
                        <div className="ml-auto">
                          {member.status === 'invited' ? (
                            <span className="whitespace-nowrap rounded bg-neutral-50 p-0.5 px-1 text-xs text-neutral-600">
                              {t('COMMON.PENDING')}
                            </span>
                          ) : member.status === 'deleted' ? (
                            <span className="rounded bg-error-100/20 p-0.5 px-1 text-xs text-error">
                              {t('COMMON.REJECTED')}
                            </span>
                          ) : undefined}
                        </div>
                      }
                    />
                    {userId !== user._id && (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button.Icon
                              size="xs"
                              variant="ghost"
                              color="default"
                            >
                              <MoreVerticalIcon />
                            </Button.Icon>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* {isAdmin && (
                              <DropdownMenuItem
                                onClick={() => {
                                  mutate({
                                    roomId: room._id,
                                    userId: member._id,
                                  });
                                }}
                              >
                                <span>{t('COMMON.REMOVE')}</span>
                              </DropdownMenuItem>
                            )} */}
                            <DropdownMenuItem asChild>
                              <Link
                                href={`${ROUTE_NAMES.ONLINE_CONVERSATION}/${user._id}`}
                              >
                                <span>{t('CONVERSATION.START')}</span>
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {/* {!isShowAll && INITIAL_SHOW_MEMBERS < members.length && (
              <div className="px-3">
                <Button
                  onClick={handleShowAll}
                  shape="square"
                  color="default"
                  size="md"
                  className="w-full"
                >
                  {t('CONVERSATION.SHOW_ALL')}
                </Button>
              </div>
            )}
            {isShowAll && INITIAL_SHOW_MEMBERS < membersToShow.length && (
              <div className="px-3">
                <Button
                  onClick={handleHide}
                  shape="square"
                  color="default"
                  size="md"
                  className="w-full"
                >
                  {t('CONVERSATION.HIDE')}
                </Button>
              </div>
            )} */}
          </div>
        </div>
        <div className="mt-auto">
          <StationLeave roomId={data._id} />
        </div>
      </div>
    </StationActions>
  );
};

const StationCard = ({ station }: { station: Station }) => {
  return (
    <div className="p-3 pb-0">
      <div className="relative flex items-center gap-3 rounded-xl bg-primary-100 px-3 py-5">
        <Avatar size="3xl" alt={station.name} src={station.avatar!} />
        <Typography variant="h4">{station.name}</Typography>
        <MoreMenu station={station} />
      </div>
    </div>
  );
};
