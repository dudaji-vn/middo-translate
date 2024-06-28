import { Button } from '@/components/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconWrapper,
} from '@/components/data-display';
import { SearchInput } from '@/components/data-entry';
import { ROUTE_NAMES } from '@/configs/route-name';
import { UserItem } from '@/features/users/components';
import { useAuthStore } from '@/stores/auth.store';
import {
  MessagesSquareIcon,
  MoreVerticalIcon,
  SendIcon,
  Trash2Icon,
  Users2Icon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRemoveStationMember } from '../hooks/use-remove-station-mebers';
import { Station } from '../types/station.types';
import { StationAddMember } from './station-add-member';

export interface StationMembersProps {
  station: Station;
}

export const StationMembers = ({ station }: StationMembersProps) => {
  const { t } = useTranslation('common');
  const userId = useAuthStore((state) => state.user?._id);
  const members = station.members;
  const owner = station.owner;
  const stationId = station._id;
  const isAdmin = station.owner?._id === userId;
  const { mutate } = useRemoveStationMember();
  return (
    <div className="flex-1">
      <div className=" bg-white pb-3 dark:bg-background">
        <div className="flex items-center justify-between gap-2.5  p-3 pl-3">
          <div className="flex items-center gap-2">
            <IconWrapper>
              <Users2Icon />
            </IconWrapper>
            <span>{t('CONVERSATION.MEMBERS')}</span>
          </div>
          <StationAddMember station={station} />
        </div>
        <div className="mb-3 px-3">
          <div className="mb-3 flex justify-end gap-3">
            <div className="flex items-center gap-1">
              <div className="flex size-5 items-center justify-center rounded-full bg-success-100 text-success">
                <SendIcon className="size-3" />
              </div>
              <span>Invited</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex size-5 items-center justify-center rounded-full bg-error-100 text-error">
                <XIcon className="size-3" />
              </div>
              <span>Rejected</span>
            </div>
          </div>
          <SearchInput placeholder={t('COMMON.SEARCH')} />
        </div>
        <div>
          {members?.map((member) => {
            const user = member.user;
            if (!user) return null;
            const isCurrentUser = user?._id === userId;
            let subContent =
              user._id === owner?._id
                ? t('CONVERSATION.ADMIN')
                : `@${user.username}`;

            if (isCurrentUser) subContent += ` (${t('CONVERSATION.YOU')})`;

            return (
              <div key={user._id} className="flex items-center justify-between">
                <UserItem
                  status={member.status}
                  wrapperClassName="hover:!bg-background flex-1 cursor-default"
                  subContent={subContent}
                  key={user._id}
                  user={user}
                />
                {userId !== user._id && (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button.Icon
                          className="mr-3"
                          size="xs"
                          variant="ghost"
                          color="default"
                        >
                          <MoreVerticalIcon />
                        </Button.Icon>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isAdmin && (
                          <DropdownMenuItem
                            onClick={() => {
                              mutate({
                                stationId: stationId,
                                email: member.email,
                              });
                            }}
                          >
                            <Trash2Icon className="mr-2 size-4 text-error" />
                            <span className="text-error">
                              {t('COMMON.REMOVE')}
                            </span>
                          </DropdownMenuItem>
                        )}
                        {member.status === 'joined' && (
                          <DropdownMenuItem asChild>
                            <Link
                              href={`${ROUTE_NAMES.STATIONS}/${stationId}/conversations/${user._id}`}
                            >
                              <MessagesSquareIcon className="mr-2 size-4" />
                              <span>{t('CONVERSATION.START')}</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
