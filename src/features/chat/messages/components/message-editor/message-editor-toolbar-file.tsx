import { Button } from '@/components/actions';
import { useMediaUpload } from '@/components/media-upload';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { FilePlus2Icon } from 'lucide-react';

export interface MessageEditorToolbarFileProps {}

export const MessageEditorToolbarFile = (
  props: MessageEditorToolbarFileProps, 
) => {
  const { open } = useMediaUpload();
  useKeyboardShortcut([SHORTCUTS.UPLOAD_FILES], () => open());

  return (
    <Button.Icon onClick={open} color="default" size="xs" variant="ghost">
      <FilePlus2Icon />
    </Button.Icon>
  );
};
