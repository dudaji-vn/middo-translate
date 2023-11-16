import { Participant } from '@/types/room';
import { Section } from './section';
import { cn } from '@/utils/cn';

export interface MemberListProps {
  members: Participant[];
}

export const MemberList = ({ members }: MemberListProps) => {
  return (
    <Section
      titleClassName="opacity-60"
      title="Members"
      rightTitle={<span>({members.length})</span>}
    >
      {members.map((member) => (
        <MemberItem key={member.socketId} user={member} />
      ))}
    </Section>
  );
};

const MemberItem = ({ user }: { user: Participant }) => {
  const bg = `bg-[${user.color}]`;
  return (
    <div className="flex items-center gap-8">
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
        <span className="mb-2">{user.username}</span>
        <span>Member</span>
      </div>
    </div>
  );
};
