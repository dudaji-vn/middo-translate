'use client';

import { TextInput, TextInputRef } from './text-input';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { AdditionalActions } from './additional-actions';
import { Button } from '@/components/actions';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { FileList } from './file-list';
import { Media } from '@/types';
import { PaperPlaneOutline } from '@easy-eva-icons/react';
import { cn } from '@/utils/cn';
import { translateText } from '@/services/languages';
import { useAuthStore } from '@/stores/auth';
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
    const userLanguage = useAuthStore((s) => s.user?.language) ?? 'en';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      console.log('handleSubmit');
      e.preventDefault();
      e?.currentTarget?.reset();
      textInputRef?.current?.reset();
      reset();
      // scroll bottom after submit
      const messageBox = document.getElementById('inbox-list');
      setTimeout(() => {
        messageBox?.scrollTo({
          top: messageBox.scrollHeight,
        });
      }, 1);
      const formData = new FormData(e.currentTarget);
      const content = formData.get('message') as string;
      let contentEnglish = formData.get('messageEnglish') as string;

      if (!contentEnglish) {
        contentEnglish = await translateText(
          content,
          userLanguage,
          DEFAULT_LANGUAGES_CODE.EN,
        );
      }

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
    };

    useEffect(() => {
      if (!textInputRef?.current?.focus) return;
      textInputRef?.current?.focus();
    }, [files.length, textInputRef]);

    return (
      <form
        id="message-editor"
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
          </div>
          <FileList
            onAddMoreFiles={open}
            files={files}
            onRemoveFile={removeFile}
          />
        </div>
        <Button.Icon type="submit" size="sm" color="primary">
          <PaperPlaneOutline />
        </Button.Icon>
      </form>
    );
  },
);
MessageEditor.displayName = 'MessageEditor';

export type { SubmitData as MessageEditorSubmitData };
