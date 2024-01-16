import { forwardRef, useEffect } from 'react';

import { Media } from '@/types';
import { useMessageEditorMedia } from './message-editor-media-context';
import { useMessageEditorText } from './message-editor-text-context';

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
  const { getRootProps, files, reset } = useMessageEditorMedia();
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

  useEffect(() => {
    focusInput();
    const inputWrapper = document.getElementById(
      'message-editor-input-wrapper',
    );
    if (files.length) {
      inputWrapper?.style.setProperty('border-radius', '1.5rem');
    } else {
      inputWrapper?.style.setProperty('border-radius', '9999px');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);
  return (
    <form
      {...props}
      {...getRootProps()}
      onSubmit={handleSubmit}
      className="relative flex w-full flex-col gap-2"
    >
      {children}
    </form>
  );
});
MessageEditorForm.displayName = 'MessageEditorForm';
