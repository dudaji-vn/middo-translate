import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { User } from '@/features/users/types';
import { detectLanguage, translateText } from '@/services/languages.service';
import { useAppStore } from '@/stores/app.store';
import { Media } from '@/types';
import { getMentionIdsFromHtml } from '@/utils/get-mention-ids-from-html';
import { Editor, EditorContent } from '@tiptap/react';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttachmentButton } from './attachment-button';
import { AttachmentSelection } from './attachment-selection';
import { EmojiButton } from './emoji-button';
import { useMediaUpload } from './media-upload';
import { MentionButton } from './mention-button';
import { MentionSuggestion } from './mention-suggestion-options';
import { MicButton, MicButtonRef } from './mic-button';
import { SendButton } from './send-button';
import { TranslationHelper } from './translation-helper';
import { useEditor } from './use-editor';
import { useChatStore } from '@/features/chat/store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { isEqual } from 'lodash';
import { ButtonProps } from './actions';
export type MessageEditorSubmitData = {
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
  onSubmitValue?: (data: MessageEditorSubmitData) => void;
  userMentions?: User[];
  onTypingChange?: (isTyping: boolean) => void;
  sendBtnProps?: ButtonProps;
}

export const MessageEditor = forwardRef<HTMLDivElement, MessageEditorProps>(
  ({ onSubmitValue, userMentions = [], sendBtnProps, onTypingChange, ...props }, ref) => {
    console.log('❤️ render editor');
    const { files, reset: filesReset, handleClipboardEvent } = useMediaUpload();
    const { t } = useTranslation('common');

    const [disabled, setDisabled] = useState(false);

    const mentionSuggestions = useMemo(() => {
      const suggestions = userMentions.map(
        (participant): MentionSuggestion => ({
          id: participant._id,
          label: participant.name,
          image: participant.avatar,
        }),
      );

      if (suggestions.length !== 0) {
        suggestions.unshift({
          label: 'Everyone',
          id: 'everyone',
          image: '',
        });
      }
      return suggestions;
    }, [userMentions]);

    const isMobile = useAppStore((s) => s.isMobile);
    const handleEnterTrigger = () => {
      document.getElementById(sendButtonId)?.click();
    };
    const editor = useEditor({
      placeholder: t('CONVERSATION.TYPE_A_MESSAGE'),
      onClipboardEvent: handleClipboardEvent,
      mentionSuggestions,
      onEnterTrigger: handleEnterTrigger,
      enterToSubmit: !isMobile,
      onTypingChange,
    });

    const editorId = useId();
    const sendButtonId = useId();

    const micRef = useRef<MicButtonRef>(null);

    const isContentEmpty = editor?.getText().trim().length === 0;

    const reset = () => {
      filesReset();
      editor?.commands.clearContent();
      micRef.current?.stop();
    };

    const handleSubmit = async () => {
      const images: Media[] = [];
      const documents: Media[] = [];
      const videos: Media[] = [];
      let content = editor?.getHTML() || '';
      let lang = '';
      let english = '';
      let mentions: string[] = [];
      reset();
      focus();
      if (!isContentEmpty) {
        lang = await detectLanguage(content);
        english = await translateText(content, lang, DEFAULT_LANGUAGES_CODE.EN);
        mentions = getMentionIdsFromHtml(content);
      } else content = '';

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
    };

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

    const focus = () => {
      document.getElementById(`input-${editorId}`)?.focus();
      editor?.commands.focus('end');
    };

    return (
      <>
        <TranslationHelper
          mentionSuggestionOptions={mentionSuggestions}
          editor={editor}
          onStartedEdit={() => setDisabled(true)}
          onFinishedEdit={() => {
            setDisabled(false);
            editor?.commands.focus('end');
          }}
        />
        <div className="relative flex gap-1">
          <div
            ref={ref}
            {...props}
            className="flex min-h-[82px] w-full flex-col rounded-xl border border-primary p-1 px-3 pb-3 shadow-sm"
          >
            <div className="-ml-2">
              <AttachmentButton />
              <EmojiButton editor={editor} />
              <MicButton ref={micRef} editor={editor} />
              {mentionSuggestions.length > 0 && (
                <MentionButton onMention={focus} editor={editor} />
              )}
            </div>
            <EditorContent
              className="max-h-[200px] min-h-[46] w-full overflow-y-auto"
              editor={editor}
            />
            <AttachmentSelection editor={editor} />
          </div>

          <input
            className="h-0 w-0 opacity-0"
            id={`input-${editorId}`}
            type="text"
          />
          <SendButton
            id={sendButtonId}
            onClick={(e) => {
              handleSubmit();
            }}
            editor={editor}
            editorId={editorId}
            {...sendBtnProps}
          />
          {editor && !isMobile && <Autofocus editor={editor} />}
          {disabled && (
            <div className="absolute left-0 top-0 h-full w-full bg-white opacity-80"></div>
          )}
        </div>
      </>
    );
  },
);
MessageEditor.displayName = 'MessageEditor';

const Autofocus = ({ editor }: { editor: Editor }) => {
  useEffect(() => {
    console.log('render Autofocus');
    editor?.commands.focus('end');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};
