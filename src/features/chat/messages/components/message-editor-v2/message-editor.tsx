'use client';

import React, {
  HTMLAttributes,
  PropsWithChildren,
  createContext,
  forwardRef,
  useContext,
} from 'react';

import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { detectLanguage, translateText } from '@/services/languages.service';
import { Media } from '@/types';
import { Editor } from '@tiptap/react';
import { BackgroundTranslation } from '../background-translation';
import { MainInput } from './main-input';
import { MediaSlot } from './media-slot';
import { MentionButton } from './mention-button';
import { MicToggleButton } from './mic-toggle-button';
import { SendButton } from './send-button';
import { Toolbar, ToolbarRef } from './toolbar';
import { TranslationHelper } from './translation-helper';
import { useEditorState } from './use-editor-state';
import { User } from '@sentry/nextjs';

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
  userMentions?: User[];
}

export interface MessageEditorRef extends HTMLAttributes<HTMLDivElement> {
  valueSubmit: () => void;
}
type MessageEditorContextProps = {
  editorId: string;
  content: string;
  setContent: (content: string) => void;
  isContentEmpty: boolean;
  setIsContentEmpty: (isEmpty: boolean) => void;
  inputDisabled: boolean;
  setInputDisabled: (disabled: boolean) => void;
  richText: Editor | null;
  setRichText: (richText: Editor | null) => void;
  handleSubmit: () => void;
  setTextContent: (text: string) => void;
  setContentEnglish: (content: string) => void;
  contentEnglish: string;
  setSrcLang: (lang: string) => void;
  srcLang: string;
  translating: boolean;
  setTranslating: (translating: boolean) => void;
  toolbarRef?: React.RefObject<ToolbarRef>;
  userMentions: User[];
};

export const MessageEditorContext = createContext<MessageEditorContextProps>(
  {} as MessageEditorContextProps,
);

export const useMessageEditor = () => {
  const context = useContext(MessageEditorContext);
  if (!context) {
    throw new Error(
      'useMessageEditorText must be used within MessageEditorTextProvider',
    );
  }
  return context;
};
export const MessageEditor = forwardRef<MessageEditorRef, MessageEditorProps>(
  (
    { onSubmitValue, disabledMedia, scrollId, userMentions = [], ...props },
    ref,
  ) => {
    const {
      content,
      contentEnglish,
      files,
      id,
      inputDisabled,
      isContentEmpty,
      micToggleButtonRef,
      richText,
      srcLang,
      translating,
      toolbarRef,
      reset,
      setContent,
      setContentEnglish,
      setIsContentEmpty,
      setRichText,
      setSrcLang,
      setTranslating,
      setInputDisabled,
      setTextContent,
    } = useEditorState();

    const handleSubmit = async () => {
      const images: Media[] = [];
      const documents: Media[] = [];
      let lang = srcLang;
      if (!lang) {
        lang = await detectLanguage(content);
      }
      let english = contentEnglish;
      if (!english) {
        english = await translateText(content, lang, DEFAULT_LANGUAGES_CODE.EN);
        console.log('english', english);
      }
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
      onSubmitValue?.({
        content,
        images,
        documents,
        contentEnglish: english,
        language: srcLang,
      });
      reset();
    };

    return (
      <MessageEditorContext.Provider
        value={{
          contentEnglish,
          setContentEnglish,
          srcLang,
          setSrcLang,
          editorId: id,
          content,
          isContentEmpty,
          inputDisabled,
          setInputDisabled,
          setContent,
          setIsContentEmpty,
          richText,
          setRichText,
          handleSubmit,
          setTextContent,
          translating,
          setTranslating,
          toolbarRef,
          userMentions,
        }}
      >
        <TranslationHelper />
        <div id={id} className="relative flex h-fit flex-row space-x-2">
          <Toolbar ref={toolbarRef} />
          <InputWrapper>
            <div className="flex">
              <MainInput />
              <MentionButton />
              <MicToggleButton
                ref={micToggleButtonRef}
                className="-mr-2 shrink-0 self-end"
              />
            </div>
            <MediaSlot />
          </InputWrapper>
          <SendButton />
          {inputDisabled && (
            <div className="absolute left-0 top-0 h-full w-full bg-white opacity-80"></div>
          )}
        </div>
        <BackgroundTranslation />
      </MessageEditorContext.Provider>
    );
  },
);
MessageEditor.displayName = 'MessageEditor';

const InputWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-[46px] w-full rounded-xl border border-primary bg-card p-1 px-3 shadow-sm">
      {children}
    </div>
  );
};

export type { SubmitData as MessageEditorSubmitData };
