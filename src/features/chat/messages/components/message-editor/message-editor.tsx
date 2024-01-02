'use client';

import { TextInput, TextInputRef } from './text-input';
import { detectLanguage, translateText } from '@/services/languages';
import { forwardRef, useEffect, useRef } from 'react';

import { Button } from '@/components/actions';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { FileList } from './file-list';
import { Media } from '@/types';
import { MessageEditorTextProvider } from './message-editor.text-context';
import { MessageEditorToolbar } from './message-editor.toolbar';
import { Send } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/features/chat/store';
import { useSelectFiles } from '@/hooks/use-select-files';

type SubmitData = {
  content: string;
  images: Media[];
  documents: Media[];
  contentEnglish: string;
  language?: string;
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
    const setSrcLang = useChatStore((s) => s.setSrcLang);
    const srcLang = useChatStore((s) => s.srcLang);

    const resetForm = (e: React.FormEvent<HTMLFormElement>) => {
      e?.currentTarget?.reset();
      textInputRef?.current?.reset();
      reset();
    };

    const scrollToBottom = () => {
      const messageBox = document.getElementById('inbox-list');
      setTimeout(() => {
        messageBox?.scrollTo({
          top: messageBox.scrollHeight,
        });
      }, 1);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      resetForm(e);
      scrollToBottom();
      const formData = new FormData(e.currentTarget);
      const content = formData.get('message') as string;
      let language = srcLang;
      if (language === 'auto') {
        language = formData.get('detLang') as string;
        if (!language) {
          language = await detectLanguage(content);
        }
      }
      setSrcLang(language);
      let contentEnglish = formData.get('messageEnglish') as string;
      if (!contentEnglish) {
        contentEnglish = await translateText(
          content,
          language,
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

      onSubmitValue?.({ content, images, documents, contentEnglish, language });
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
        className="relative flex w-full flex-col gap-2"
      >
        <MessageEditorTextProvider>
          <MessageEditorToolbar />
          <div className="relative flex w-full items-center gap-2">
            <input {...getInputProps()} hidden />
            <div
              className={cn(
                'flex-1 items-center gap-2 border  border-primary bg-card p-1 px-4 shadow-sm',
                files.length > 0 ? 'rounded-3xl' : 'rounded-full',
              )}
            >
              <div className="flex min-h-9 flex-1">
                <TextInput ref={textInputRef} onPaste={handlePasteFile} />
              </div>
              <FileList
                onAddMoreFiles={open}
                files={files}
                onRemoveFile={removeFile}
              />
            </div>
            <Button.Icon type="submit" size="sm" color="primary">
              <Send />
            </Button.Icon>
          </div>
        </MessageEditorTextProvider>
      </form>
    );
  },
);
MessageEditor.displayName = 'MessageEditor';

export type { SubmitData as MessageEditorSubmitData };
