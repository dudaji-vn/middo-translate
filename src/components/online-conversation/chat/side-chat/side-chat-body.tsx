import { MemberList } from './member-list';

export interface SideChatBodyProps {}

export const SideChatBody = (props: SideChatBodyProps) => {
  return (
    <div className="bg-background">
      <MemberList members={[]} />
    </div>
  );
};
