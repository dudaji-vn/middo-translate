import { Participant } from '@/types/room';
import { Section } from './section';
import { cn } from '@/utils/cn';
import { useState } from 'react';

export interface MemberListProps {
  members: Participant[];
  hostSocketId?: string;
}

const MAX_SHOW_COUNT = 2;

export const MemberList = ({ members, hostSocketId }: MemberListProps) => {
  const [isShowAll, setIsShowAll] = useState(false);
  const [showCount, setShowCount] = useState(MAX_SHOW_COUNT);
  const isShowAllMembers = members.length <= MAX_SHOW_COUNT || isShowAll;
  const showMembers = isShowAllMembers ? members : members.slice(0, showCount);
  return (
    <Section
      titleClassName="opacity-60"
      title="Members"
      rightTitle={<span>({members.length})</span>}
    >
      {showMembers.map((member) => (
        <MemberItem
          isHost={member.socketId === hostSocketId}
          key={member.socketId}
          user={member}
        />
      ))}
      {members.length > MAX_SHOW_COUNT && (
        <>
          {!isShowAllMembers ? (
            <div
              onClick={() => {
                setIsShowAll(true);
                setShowCount(members.length);
              }}
              className="flex cursor-pointer items-center justify-center py-3"
            >
              <p className="text-primary">Show all</p>
            </div>
          ) : (
            <div
              onClick={() => {
                setIsShowAll(false);
                setShowCount(MAX_SHOW_COUNT);
              }}
              className="flex cursor-pointer items-center justify-center py-3"
            >
              <p className="text-primary">Hide</p>
            </div>
          )}
        </>
      )}
    </Section>
  );
};

const MemberItem = ({
  user,
  isHost,
}: {
  user: Participant;
  isHost: boolean;
}) => {
  const bg = `bg-[${user.color}]`;
  return (
    <div className="flex items-center gap-2 py-3">
      <div
        style={{ backgroundColor: user.color }}
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full text-background',
          bg,
        )}
      >
        {user.username[0]}
      </div>
      <div>
        <p className="font-medium">{user.username}</p>
        <p>{isHost ? 'Host' : 'Member'}</p>
      </div>
    </div>
  );
};
