import { Button } from '@/components/actions';
import { SendIcon } from 'lucide-react';
import { useMessageEditorMedia } from './message-editor-media-context';
import { useMessageEditorText } from './message-editor-text-context';

export interface MessageEditorSubmitButtonProps {}

export const MessageEditorSubmitButton = (
  props: MessageEditorSubmitButtonProps,
) => {
  const { text } = useMessageEditorText();
  const { files } = useMessageEditorMedia();
  const disabled = text.length === 0 && files.length === 0;
  if (disabled) {
    return null;
  }
  return (
    <Button.Icon type="submit" size="xs" color="primary">
      <SendIcon />
    </Button.Icon>
  );
};
