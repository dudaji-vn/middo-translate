'use client';

import {
  HTMLAttributes,
  PropsWithChildren,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
} from 'react';

import { Media } from '@/types';
import { MediaSlot } from './media-slot';
import { MessageEditorToolbarTranslateTool } from './translate-preview';
import { SendButton } from './send-button';
import { Toolbar } from './toolbar';
import { RichTextInput } from './rich-text-input';
import { Editor } from '@tiptap/react';
import { MicToggleButton, MicToggleButtonRef } from './mic-toggle-button';
import { useMediaUpload } from '@/components/media-upload';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useAuthStore } from '@/stores/auth.store';
import { BackgroundTranslation } from '../background-translation';

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
  ({ onSubmitValue, disabledMedia, scrollId, ...props }, ref) => {
    const id = useId();
    const { files, reset } = useMediaUpload();
    const [shrinkToolbar, setShrinkToolbar] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [content, setContent] = useState('');
    const [isContentEmpty, setIsContentEmpty] = useState(true);
    const [richText, setRichText] = useState<Editor | null>(null);
    const micToggleButtonRef = useRef<MicToggleButtonRef>(null);
    const [contentEnglish, setContentEnglish] = useState('');
    const userLang = useAuthStore((state) => state.user?.language);
    const [srcLang, setSrcLang] = useState(
      userLang || DEFAULT_LANGUAGES_CODE.EN,
    );

    const resetEditor = () => {
      micToggleButtonRef.current?.stop();
      richText?.commands.clearContent();
      setContent('');
      setIsContentEmpty(true);
      reset();
    };
    const handleSubmit = async () => {
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
      onSubmitValue?.({
        content,
        images,
        documents,
        contentEnglish,
        language: srcLang,
      });
      resetEditor();
    };

    const setTextContent = useCallback(
      (text: string) => {
        richText?.commands.clearContent();
        richText?.commands.insertContent({
          type: 'text',
          text: text,
        });
      },
      [richText],
    );

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
        }}
      >
        <MessageEditorToolbarTranslateTool />
        <div id={id} className="relative flex h-fit flex-row space-x-2">
          <Toolbar
            shrink={shrinkToolbar}
            onExpand={() => {
              setShrinkToolbar(false);
            }}
          />
          <InputWrapper>
            <div className="flex">
              <RichTextInput className="max-h-[200px] w-full overflow-y-auto pt-1" />
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
