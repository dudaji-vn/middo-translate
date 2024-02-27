import { Button, ButtonProps } from '@/components/actions';
import { SendIcon } from 'lucide-react';

import { useMessageEditorText } from './message-editor-text-context';
import { useMediaUpload } from '@/components/media-upload';



export const MessageEditorSubmitButton = (
  props: ButtonProps
) => {
  const { text } = useMessageEditorText();
  const { files } = useMediaUpload();
  const disabled = text.trim().length === 0 && files.length === 0;
  if (disabled) {
    return null;
  }
  return (
    <Button.Icon type="submit" size="xs" color="primary" {...props}>
      <SendIcon />
    </Button.Icon>
  );
};
