'use client';

import {
  HTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import { MessageEditorToolbarTranslateTool } from './message-editor-toolbar-translate';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import isEqual from 'lodash/isEqual';
import { SendIcon } from 'lucide-react';

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
    const isMobile = useAppStore((state) => state.isMobile);
    const [shrinkToolbar, setShrinkToolbar] = useState(false);

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

    const { toggleShowTranslateOnType, toggleShowMiddleTranslation } =
      useChatStore();
    useKeyboardShortcut(
      [
        SHORTCUTS.TURN_ON_OFF_TRANSLATION,
        SHORTCUTS.TURN_ON_OFF_TRANSLATION_PREVIEW,
      ],
      (_, matchedKey) => {
        if (isEqual(matchedKey, SHORTCUTS.TURN_ON_OFF_TRANSLATION)) {
          toggleShowMiddleTranslation();
          return;
        }
        if (isEqual(matchedKey, SHORTCUTS.TURN_ON_OFF_TRANSLATION_PREVIEW)) {
          toggleShowTranslateOnType();
        }
      },
      true,
    );

    return (
      <MessageEditorTextProvider>
        <MessageEditorToolbarTranslateTool />
        <div className={cn('relative flex h-fit flex-row space-x-2')}>
          <MessageEditorToolbar
            shrink={shrinkToolbar}
            onExpand={() => {
              setShrinkToolbar(false);
            }}
          />
          <MessageEditorForm onFormSubmit={handleSubmit}>
            <div className="relative flex w-full flex-row items-end">
              <div className="w-full rounded-xl border border-primary bg-card p-1 px-3 shadow-sm">
                <TextInput
                  isToolbarShrink={shrinkToolbar}
                  ref={textInputRef}
                  onFocus={(e) => {
                    setShrinkToolbar(isMobile);
                  }}
                  onBlur={() => {
                    setShrinkToolbar(false);
                  }}
                />
                <MessageEditorMediaBar />
              </div>
              <div className="relative h-full w-fit flex flex-row items-end pb-[1px] md:pb-[5px]">
                <MessageEditorSubmitButton className='ml-2'/>
              </div>
            </div>
          </MessageEditorForm>
        </div>
      </MessageEditorTextProvider>
    );
  },
);
MessageEditor.displayName = 'MessageEditor';

export type { SubmitData as MessageEditorSubmitData };
