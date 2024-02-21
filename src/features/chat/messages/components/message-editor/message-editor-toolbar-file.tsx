import { Button } from '@/components/actions';
import { useMediaUpload } from '@/components/media-upload';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { FilePlus2Icon } from 'lucide-react';

export interface MessageEditorToolbarFileProps {}

const SHORTCUT_UPLOAD_FILE = ['shift', 'u'];
export const MessageEditorToolbarFile = (
  props: MessageEditorToolbarFileProps, 
) => {
  const { open } = useMediaUpload();
  useKeyboardShortcut(SHORTCUT_UPLOAD_FILE, () => open());

  return (
    <Button.Icon onClick={open} color="default" size="xs" variant="ghost">
      <FilePlus2Icon />
    </Button.Icon>
  );
};
