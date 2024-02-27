'use client';

import { HTMLAttributes, forwardRef, useImperativeHandle, useRef } from 'react';
import { TextInput, TextInputRef } from './message-editor-text-input';
import { detectLanguage, translateText } from '@/services/languages.service';

import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { FileWithUrl } from '@/hooks/use-select-files';
import { Media } from '@/types';
import { MessageEditorForm } from './message-editor-form';
import { MessageEditorMediaBar } from './message-editor-media-bar';
import { MessageEditorSubmitButton } from './message-editor-submit-button';
import { MessageEditorTextProvider } from './message-editor-text-context';
import { MessageEditorToolbar } from './message-editor-toolbar';
import { useChatStore } from '@/features/chat/store';

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
  disabledMedia?: boolean;
  scrollId?: string;
}

export interface MessageEditorRef extends HTMLAttributes<HTMLDivElement> {
  valueSubmit: () => void;
}

export const MessageEditor = forwardRef<MessageEditorRef, MessageEditorProps>(
  ({ onSubmitValue, disabledMedia, scrollId, ...props }, ref) => {
    const textInputRef = useRef<TextInputRef>(null);
    const setSrcLang = useChatStore((s) => s.setSrcLang);
    const srcLang = useChatStore((s) => s.srcLang);

    const resetForm = (e: React.FormEvent<HTMLFormElement>) => {
      e?.currentTarget?.reset();
      textInputRef?.current?.reset();
    };

    const scrollToBottom = () => {
      const messageBox = document.getElementById(scrollId || '');
      setTimeout(() => {
        messageBox?.scrollTo({
          top: messageBox.scrollHeight,
        });
      }, 1);
    };

    const handleSubmit = async (
      e: React.FormEvent<HTMLFormElement>,
      files: {
        images: Media[];
        documents: Media[];
      },
    ) => {
      resetForm(e);
      scrollToBottom();
      const formData = new FormData(e.currentTarget);
      const content = formData.get('message') as string;
      let language = srcLang;
      if (content) {
        if (language === 'auto') {
          language = formData.get('detLang') as string;
          if (!language) {
            language = await detectLanguage(content);
          }
        }
        setSrcLang(language);
      }
      let contentEnglish = formData.get('messageEnglish') as string;
      if (!contentEnglish) {
        contentEnglish = await translateText(
          content,
          language,
          DEFAULT_LANGUAGES_CODE.EN,
        );
      }
      const images = files.images || [];
      const documents = files.documents || [];
      onSubmitValue?.({ content, images, documents, contentEnglish, language });
    };

    useImperativeHandle(ref, () => ({
      valueSubmit: () => {
        const formRef = document.getElementById('message-editor');
        if (!formRef) return;
        formRef?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      },
    }));

    return (
      <MessageEditorTextProvider>
        <MessageEditorToolbar />
        <MessageEditorForm onFormSubmit={handleSubmit}>
          <div className="relative flex w-full items-center gap-2">
            <div className="flex-1 items-center gap-2 rounded-xl border border-primary bg-card p-1 px-3 shadow-sm">
              <div className="flex min-h-9 pt-[6px] flex-1">
                <TextInput ref={textInputRef} />
              </div>
              <MessageEditorMediaBar />
            </div>
            <MessageEditorSubmitButton  className='invisible' disabled/>
            <MessageEditorSubmitButton  className='absolute right-0 bottom-[6px]'/>
          </div>
        </MessageEditorForm>
      </MessageEditorTextProvider>
    );
  },
);
MessageEditor.displayName = 'MessageEditor';

export type { SubmitData as MessageEditorSubmitData };
