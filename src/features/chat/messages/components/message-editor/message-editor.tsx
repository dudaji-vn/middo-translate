import { MicOutline, PaperPlaneOutline } from '@easy-eva-icons/react';
import { TextInput, TextInputRef } from './text-input';
import { forwardRef, useRef } from 'react';

import { AdditionalActions } from './additional-actions';
import { Button } from '@/components/actions';
import { FileList } from './file-list';
import { Media } from '@/types';
import { Smile } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useSelectFiles } from '@/hooks/use-select-files';

type SubmitData = {
  content: string;
  images: Media[];
  documents: Media[];
  contentEnglish: string;
};

export interface MessageEditorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onSubmitValue?: (data: SubmitData) => void;
}

export const MessageEditor = forwardRef<HTMLDivElement, MessageEditorProps>(
  ({ onSubmitValue, ...props }, ref) => {
    const {
      files,
      getInputProps,
      getRootProps,
      open,
      removeFile,
      handlePasteFile,
      reset,
    } = useSelectFiles();

    const textInputRef = useRef<TextInputRef>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const content = formData.get('message') as string;
      const contentEnglish = formData.get('messageEnglish') as string;
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
      onSubmitValue?.({ content, images, documents, contentEnglish });
      e.currentTarget.reset();
      textInputRef.current?.reset();
      reset();
    };
    return (
      <form
        {...getRootProps()}
        onSubmit={handleSubmit}
        className="relative flex w-full items-center gap-2"
      >
        <input {...getInputProps()} hidden />
        <div
          className={cn(
            'flex-1 items-center gap-2 border  border-primary bg-card p-1 shadow-sm',
            files.length > 0 ? 'rounded-3xl' : 'rounded-full',
          )}
        >
          <div className="flex flex-1">
            <AdditionalActions onOpenSelectFiles={open} />
            <TextInput ref={textInputRef} onPaste={handlePasteFile} />
            <div className="h-full items-end">
              <Button.Icon variant="ghost" className="self-end" color="default">
                <MicOutline />
              </Button.Icon>
              <Button.Icon variant="ghost" className="self-end" color="default">
                <Smile />
              </Button.Icon>
            </div>
          </div>
          <FileList
            onAddMoreFiles={open}
            files={files}
            onRemoveFile={removeFile}
          />
        </div>
        <Button.Icon color="primary">
          <PaperPlaneOutline />
        </Button.Icon>
      </form>
    );
  },
);
MessageEditor.displayName = 'MessageEditor';

export type { SubmitData as MessageEditorSubmitData };
