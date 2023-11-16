import { SideChatBody } from './side-chat-body';
import { SideChatFooter } from './side-footer';
import { SideChatHeader } from './side-chat-header';

export interface SideChatProps {}

export const SideChat = (props: SideChatProps) => {
  return (
    <div className="flex min-w-[30vw] flex-col gap-3 bg-background-darker">
      <SideChatHeader code="ahls" />
      <SideChatBody />
      <SideChatFooter />
    </div>
  );
};
