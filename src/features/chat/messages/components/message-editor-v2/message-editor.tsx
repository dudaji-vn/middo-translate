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
import { getMentionIdsFromHtml } from '@/utils/get-mention-ids-from-html';

type SubmitData = {
  content: string;
  images: Media[];
  videos: Media[];
  documents: Media[];
  contentEnglish: string;
  language?: string;
  mentions?: string[];
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
  inputDisabled: boolean;
  setInputDisabled: (disabled: boolean) => void;
  richText: Editor | null;
  setRichText: (richText: Editor | null) => void;
  handleSubmit: () => void;
  setTextContent: (text: string) => void;
  setContentEnglish: (content: string) => void;
  contentEnglish: string;
  setSrcLang: (lang: string) => void;
  srcLang: string | null;
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
      setRichText,
      setSrcLang,
      setTranslating,
      setInputDisabled,
      setTextContent,
    } = useEditorState();

    const handleSubmit = async () => {
      const images: Media[] = [];
      const documents: Media[] = [];
      const videos: Media[] = [];
      const content = richText?.getHTML() || '';
      const mentions = getMentionIdsFromHtml(content);

      let lang = '';
      let english = '';

      if (!isContentEmpty) {
        lang = await detectLanguage(content);
        english = await translateText(content, lang, DEFAULT_LANGUAGES_CODE.EN);
      }

      for (const file of files) {
        switch (file.file.type.split('/')[0]) {
          case 'image':
            images.push({
              url: file.url,
              type: 'image',
              file: file.file,
              name: file.file.name,
              size: file.file.size,
            });
            break;
          case 'video':
            videos.push({
              url: file.url,
              type: 'video',
              file: file.file,
              name: file.file.name,
              size: file.file.size,
            });
            break;
          default:
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
        language: lang,
        mentions: mentions,
        videos,
      });
      // scroll to bottom
      const messageBox = document.getElementById(scrollId || '');
      setTimeout(() => {
        messageBox?.scrollTo({
          top: messageBox.scrollHeight,
        });
      }, 1);
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
    <div className="flex min-h-[46px] w-full flex-col rounded-xl border border-primary bg-card p-1 px-3 shadow-sm">
      {children}
    </div>
  );
};

export type { SubmitData as MessageEditorSubmitData };
