import { Button, ButtonProps } from '@/components/actions';
import { SendIcon } from 'lucide-react';
import { useMediaUpload } from '@/components/media-upload';
import { useMessageEditor } from '.';

export const SendButton = (props: ButtonProps) => {
  const { handleSubmit, editorId, richText } = useMessageEditor();
  const { files } = useMediaUpload();
  const isContentEmpty = !richText?.state.doc.textContent.trim().length;
  const disabled = isContentEmpty && files.length === 0;
  if (disabled) {
    return null;
  }
  return (
    <div className="flex-rows flex items-end pb-[5px] max-md:pb-[1px]">
      <Button.Icon
        id={`send-button-${editorId}`}
        onClick={handleSubmit}
        size="xs"
        color="primary"
        {...props}
      >
        <SendIcon />
      </Button.Icon>
    </div>
  );
};
