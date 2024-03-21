import { Button } from '@/components/actions';
import { useMessageEditor } from '.';
import { AtSignIcon } from 'lucide-react';
export interface MentionButtonProps {}

export const MentionButton = (props: MentionButtonProps) => {
  const { richText, userMentions } = useMessageEditor();
  if (!userMentions.length) return null;
  return (
    <Button.Icon
      color="default"
      variant="ghost"
      size="xs"
      className="shrink-0 self-end"
      onClick={() => {
        const mentionState = (
          richText?.state as unknown as {
            [key: string]: {
              active: boolean;
            };
          }
        )['mention$'];
        if (mentionState.active) return;
        richText?.commands.insertContent({
          type: 'text',
          text: '@',
        });
      }}
    >
      <AtSignIcon />
    </Button.Icon>
  );
};
