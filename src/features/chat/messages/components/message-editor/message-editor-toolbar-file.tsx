import { Button } from '@/components/actions';
import { useMediaUpload } from '@/components/media-upload';
import { FilePlus2Icon } from 'lucide-react';

export interface MessageEditorToolbarFileProps {}

export const MessageEditorToolbarFile = (
  props: MessageEditorToolbarFileProps,
) => {
  const { open } = useMediaUpload();

  return (
    <Button.Icon onClick={open} color="default" size="xs" variant="ghost">
      <FilePlus2Icon />
    </Button.Icon>
  );
};
