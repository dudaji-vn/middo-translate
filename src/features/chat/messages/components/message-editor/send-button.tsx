import { Button, ButtonProps } from '@/components/actions';
import { SendIcon } from 'lucide-react';
import { useMediaUpload } from '@/components/media-upload';
import { Editor } from '@tiptap/react';
type SendButtonProps = {
  editorId: string;
  editor: Editor | null;
} & ButtonProps;
export const SendButton = ({ editor, editorId, ...props }: SendButtonProps) => {
  const { files } = useMediaUpload();
  const isContentEmpty = editor?.getText().trim().length === 0;
  const disabled = isContentEmpty && files.length === 0;
  if (disabled || !editor) {
    return null;
  }
  return (
    <div className="flex-rows flex items-end">
      <Button.Icon size="xs" color="primary" {...props}>
        <SendIcon />
      </Button.Icon>
    </div>
  );
};
