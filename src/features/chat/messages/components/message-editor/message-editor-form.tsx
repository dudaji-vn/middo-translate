import { forwardRef } from 'react';

import { Media } from '@/types';
import { useMessageEditorText } from './message-editor-text-context';
import { useMediaUpload } from '@/components/media-upload';

export interface MessageEditorFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  onFormSubmit?: (
    e: React.FormEvent<HTMLFormElement>,
    files: {
      images: Media[];
      documents: Media[];
    },
  ) => void;
}

export const MessageEditorForm = forwardRef<
  HTMLFormElement,
  MessageEditorFormProps
>(({ onFormSubmit, children, ...props }, ref) => {
  const { files, reset } = useMediaUpload();
  const { focusInput } = useMessageEditorText();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reset();
    const images: Media[] = [];
    const documents: Media[] = [];
    for (const file of files) {
      if (file.file.type.startsWith('image')) {
        images.push({
          url: file.url,
          type: 'image',
          file: file.file,
          name: file.file.name,
          size: file.file.size,
        });
      } else {
        documents.push({
          url: file.url,
          type: 'document',
          file: file.file,
          name: file.file.name,
          size: file.file.size,
        });
      }
    }
    onFormSubmit?.(e, {
      images,
      documents,
    });
  };

  return (
    <form
      {...props}
      onSubmit={handleSubmit}  id="message-editor"
      className="relative flex w-full  flex-col gap-2"
    >
      {children}
    </form>
  );
});
MessageEditorForm.displayName = 'MessageEditorForm';
