import { Button } from '@/components/actions';
import { Editor } from '@tiptap/react';
import { AtSignIcon } from 'lucide-react';
export interface MentionButtonProps {
  editor: Editor | null;
  onMention?: () => void;
}

export const MentionButton = ({ editor, onMention }: MentionButtonProps) => {
  return (
    <Button.Icon
      color="default"
      variant="ghost"
      size="xs"
      className="shrink-0 self-end"
      onClick={() => {
        onMention?.();
        const mentionState = (
          editor?.state as unknown as {
            [key: string]: {
              active: boolean;
            };
          }
        )['mention$'];
        if (mentionState.active) return;
        editor?.commands.insertContent({
          type: 'text',
          text: '@',
        });
      }}
    >
      <AtSignIcon />
    </Button.Icon>
  );
};
