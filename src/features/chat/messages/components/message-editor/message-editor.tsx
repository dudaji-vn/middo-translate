import { MicOutline, PaperPlaneOutline } from '@easy-eva-icons/react';

import { AdditionalActions } from './additional-actions';
import { Button } from '@/components/actions';
import { FileList } from './file-list';
import { Media } from '../../types';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { useSelectFiles } from '@/hooks/use-select-files';

type SubmitData = {
  content: string;
  images: Media[];
  documents: Media[];
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const content = formData.get('message') as string;
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
      onSubmitValue?.({ content, images, documents });
      e.currentTarget.reset();
      reset();
    };
    return (
      <form
        {...getRootProps()}
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 "
      >
        <input {...getInputProps()} hidden />
        <div
          className={cn(
            'min-h-[3.75rem] flex-1 items-center gap-2 border  border-primary bg-card p-2 shadow-sm',
            files.length > 0 ? 'rounded-3xl' : 'rounded-full',
          )}
        >
          <div className="flex flex-1">
            <AdditionalActions onOpenSelectFiles={open} />
            <input
              autoComplete="off"
              onPaste={handlePasteFile}
              name="message"
              type="text"
              className="flex-1 bg-transparent outline-none"
              placeholder="Type a message"
            />
            <div className="h-full items-end">
              <Button.Icon variant="ghost" className="self-end" color="default">
                <MicOutline />
              </Button.Icon>

              <Button.Icon variant="ghost" color="primary" className="self-end">
                <PaperPlaneOutline />
              </Button.Icon>
            </div>
          </div>
          <FileList
            onAddMoreFiles={open}
            files={files}
            onRemoveFile={removeFile}
          />
        </div>
      </form>
    );
  },
);
MessageEditor.displayName = 'MessageEditor';

export type { SubmitData as MessageEditorSubmitData };
