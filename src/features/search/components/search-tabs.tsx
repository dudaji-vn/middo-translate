import { Section } from '@/components/data-display';
import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Message } from '@/features/chat/messages/types';
import { RoomItem } from '@/features/chat/rooms/components/room-item';
import { Room } from '@/features/chat/rooms/types';
import { UserItem } from '@/features/users/components';
import { User } from '@/features/users/types';
import { useQuerySearch } from '@/hooks/use-query-search';
import { useMutation, useQuery } from '@tanstack/react-query';
import { convert } from 'html-to-text';
import {
  MessagesSquareIcon,
  SearchIcon,
  UserRound,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchApi } from '../api';
import { SearchType } from '../types';
import moment from 'moment';
import { generateRoomDisplay } from '@/features/chat/rooms/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useSearchDynamic } from '../hooks/use-search-dynamic';
import {
  useBusinessNavigationData,
  useCursorPaginationQuery,
  useStationNavigationData,
} from '@/hooks';
import { Button } from '@/components/actions';

export interface SearchTabsProps {
  searchValue: string;
  onTabChange?: (type: SearchType) => void;
}

const tabs: Record<
  SearchType,
  { label: string; value: SearchType; icon?: React.ReactNode }
> = {
  all: {
    label: 'COMMON.ALL',
    value: 'all',
    icon: <SearchIcon className="size-5 md:size-4" />,
  },
  user: {
    label: 'COMMON.USER',
    value: 'user',
    icon: <UserRound className="size-5 md:size-4" />,
  },
  group: {
    label: 'COMMON.GROUP',
    value: 'group',
    icon: <UsersRound className="size-5 md:size-4" />,
  },
  message: {
    label: 'COMMON.MESSAGE',
    value: 'message',
    icon: <MessagesSquareIcon className="size-5 md:size-4" />,
  },
};

export const SearchTabs = ({ searchValue, onTabChange }: SearchTabsProps) => {
  const [type, setType] = useState<SearchType>('all');
  const { stationId } = useStationNavigationData();
  const { mutate } = useMutation({
    mutationFn: searchApi.createKeyword,
  });
  const { t } = useTranslation('common');
  // call api to count the number of results for each tab
  const { data } = useQuery({
    queryFn: () => searchApi.count({ q: searchValue || '', stationId }),
    queryKey: ['search', 'count', searchValue],
  });

  const countData = useMemo(() => {
    return {
      user: data?.totalUsers || 0,
      group: data?.totalGroups || 0,
      message: data?.totalMessages || 0,
    };
  }, [data]);
  const ResultComp = useMemo(() => {
    switch (type) {
      case 'user':
        return UsersResult;
      case 'group':
        return RoomsResult;
      case 'message':
        return MessagesResult;
      default:
        return AllResult;
    }
  }, [type]);
  const handleItemClick = ({
    type = 'all',
    id = '',
  }: {
    type?: SearchType;
    id?: string;
  }) => {
    mutate({ keyword: searchValue });
  };

  return (
    <>
      <Tabs defaultValue="all" value={type} className="w-full">
        <TabsList>
          {Object.values(tabs).map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => {
                setType(tab.value);
                onTabChange?.(tab.value);
              }}
              className="!rounded-none"
            >
              <div className="relative">
                {type === tab.value ? (
                  <>{t(tab.label)}</>
                ) : (
                  <>
                    <div className="h-5"> {tab?.icon || t(tab.label)}</div>
                    {tab.value !== 'all' && (
                      <div className="absolute right-0 top-0 size-4 translate-x-1/2 translate-y-1/2 rounded-full bg-primary text-xs text-white">
                        {countData[tab.value] > 9 ? '+9' : countData[tab.value]}
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {searchValue && (
        <div className="flex-1 overflow-y-auto py-3">
          <ResultComp
            countData={countData}
            onItemClick={handleItemClick}
            searchValue={searchValue}
            onSeeAll={(type) => {
              setType(type);
              onTabChange?.(type);
            }}
          />
        </div>
      )}
    </>
  );
};

type ResultProps = {
  searchValue: string;
  onItemClick: (data: { type: SearchType; id: string }) => void;
  countData: { user: number; group: number; message: number };
  onSeeAll?: (type: SearchType) => void;
};

const UsersResult = ({ searchValue, onItemClick }: ResultProps) => {
  const { data } = useSearchDynamic({
    searchValue,
    type: 'user',
  });

  if (!data) return null;
  const users = data.items as User[];
  return (
    <div>
      {users?.map((user) => (
        <SearchUserItem key={user._id} user={user} onItemClick={onItemClick} />
      ))}
    </div>
  );
};
const MessagesResult = ({ searchValue, onItemClick }: ResultProps) => {
  const { data } = useSearchDynamic({
    searchValue,
    type: 'message',
  });
  const messages = data?.items as Message[];
  return (
    <MessagesList
      onItemClick={onItemClick}
      messages={messages}
      searchValue={searchValue}
    />
  );
};

const RoomsResult = ({ searchValue, onItemClick }: ResultProps) => {
  const { data } = useSearchDynamic({
    searchValue,
    type: 'group',
  });
  const rooms = data?.items as Room[];
  return (
    <div>
      {rooms?.map((room) => {
        return (
          <RoomItem
            onClick={() => {
              onItemClick({ type: 'group', id: room._id });
            }}
            disabledAction
            key={room._id}
            data={room}
            showMembersName
            showTime={false}
          />
        );
      })}
    </div>
  );
};

const LIMIT = 3;

const AllResult = ({
  searchValue,
  onItemClick,
  countData,
  onSeeAll,
}: ResultProps & {
  countData: { user: number; group: number; message: number };
}) => {
  const { t } = useTranslation('common');
  const { spaceId } = useBusinessNavigationData();
  const { data } = useQuerySearch<{
    rooms: Room[];
    users: User[];
    messages: Message[];
  }>({
    searchApi: searchApi.inboxes,
    queryKey: 'chat-search',
    searchTerm: searchValue || '',
    businessSpaceParams: {
      spaceId: spaceId as string,
    },
    limit: LIMIT,
  });
  if (!data) return null;
  return (
    <>
      {data?.users && data.users.length > 0 && (
        <Section label={t('CONVERSATION.PEOPLE')}>
          {data?.users?.map((user) => (
            <SearchUserItem
              key={user._id}
              user={user}
              onItemClick={onItemClick}
            />
          ))}
          {countData.user > LIMIT && (
            <div className="mt-1 px-3">
              <Button
                onClick={() => onSeeAll?.('user')}
                size="md"
                className="w-full"
                color="secondary"
                shape="square"
              >
                See all result
              </Button>
            </div>
          )}
        </Section>
      )}
      {data?.rooms && data.rooms.length > 0 && (
        <div className="mt-5">
          <Section label={'Groups'}>
            {data?.rooms.map((room) => (
              <RoomItem
                onClick={() => {
                  onItemClick({ type: 'group', id: room._id });
                }}
                disabledAction
                key={room._id}
                data={room}
                showMembersName
                showTime={false}
              />
            ))}
            {countData.group > LIMIT && (
              <div className="mt-1 px-3">
                <Button
                  onClick={() => onSeeAll?.('group')}
                  size="md"
                  className="w-full"
                  color="secondary"
                  shape="square"
                >
                  See all result
                </Button>
              </div>
            )}
          </Section>
        </div>
      )}
      {data?.messages && data.messages.length > 0 && (
        <div className="mt-5">
          <Section label={'Message'}>
            <MessagesList messages={data.messages} searchValue={searchValue} />
          </Section>
          {countData.message > LIMIT && (
            <div className="mt-1 px-3">
              <Button
                onClick={() => onSeeAll?.('message')}
                size="md"
                className="w-full"
                color="secondary"
                shape="square"
              >
                See all result
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const MessagesList = ({
  messages,
  searchValue,
  onItemClick,
}: {
  messages: Message[];
  searchValue: string;
  onItemClick?: (data: { type: SearchType; id: string }) => void;
}) => {
  useEffect(() => {
    const container = document.querySelector('.highlight-container');
    if (!container) return;
    const highlight = container.querySelectorAll('.highlight-able');
    highlight.forEach((el) => {
      el.innerHTML = el.innerHTML.replace(
        new RegExp(searchValue, 'gi'),
        (match) => `<span class="highlight">${match}</span>`,
      );
    });
  }, [searchValue]);

  if (!messages || !messages.length) return null;

  return (
    <div className="highlight-container">
      {messages?.map((message) => (
        <MessageItem
          onClick={() => onItemClick?.({ type: 'message', id: message._id })}
          key={message?._id}
          message={message}
        />
      ))}
    </div>
  );
};

const MessageItem = ({
  message,
  onClick,
}: {
  message: Message;
  onClick?: () => void;
}) => {
  const userId = useAuthStore((state) => state.user?._id);
  const room = generateRoomDisplay({
    room: message.room!,
    currentUserId: userId!,
  });
  const lang = useAuthStore((state) => state.user?.language);
  const contentDisplay = useMemo(() => {
    const content = message.translations?.[lang || 'en'] || message.content;
    return convert(content, {
      selectors: [{ selector: 'a', options: { ignoreHref: true } }],
    });
  }, [lang, message.content, message.translations]);
  return (
    <Link
      key={message?._id}
      href={
        ROUTE_NAMES.ONLINE_CONVERSATION +
        '/' +
        room._id +
        '?search_id=' +
        message._id
      }
      onClick={onClick}
    >
      <UserItem
        topContent={room.name}
        subContent={contentDisplay}
        user={message.sender}
        rightElement={
          <span className="ml-auto shrink-0 pl-2 text-xs font-light text-neutral-300">
            {moment(message.createdAt).format('LT')}
          </span>
        }
      />
    </Link>
  );
};
const SearchUserItem = ({
  user,
  onItemClick,
}: {
  user: User;
  onItemClick: (data: { type: SearchType; id: string }) => void;
}) => {
  let link = `${ROUTE_NAMES.ONLINE_CONVERSATION}/${user._id}`;
  const { isOnStation, stationId } = useStationNavigationData();
  if (isOnStation) {
    link = `${ROUTE_NAMES.STATIONS}/${stationId}/conversations/${user._id}`;
  }
  return (
    <Link
      key={user?._id}
      href={link}
      onClick={() => onItemClick({ type: 'user', id: user._id })}
    >
      <UserItem user={user} />
    </Link>
  );
};
