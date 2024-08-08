import { Button } from '@/components/actions';
import { Separator } from '@/components/ui/separator';
import { Editor, BubbleMenu as TTBubbleMenu } from '@tiptap/react';
import { BoldIcon, Code2Icon, ItalicIcon, ListIcon } from 'lucide-react';

export interface BubbleMenuProps {
  editor: Editor;
}

export const BubbleMenu = ({ editor }: BubbleMenuProps) => {
  return (
    <TTBubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="bubble-menu flex gap-1 rounded-xl border bg-white p-2">
        <Button.Icon
          variant="ghost"
          size="ss"
          color="default"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </Button.Icon>
        <Button.Icon
          variant="ghost"
          size="ss"
          color="default"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </Button.Icon>
        <Button.Icon
          variant="ghost"
          size="ss"
          color="default"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon />
        </Button.Icon>
        <Button.Icon
          variant="ghost"
          size="ss"
          color="default"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2Icon />
        </Button.Icon>
      </div>
    </TTBubbleMenu>
  );
};
