import { messageApi } from '@/features/chat/messages/api';
import { useMessageActions } from '@/features/chat/messages/components/message-actions';
import { Message } from '@/features/chat/messages/types';
import { useChatStore } from '@/features/chat/stores';
import { useDraftStore } from '@/features/chat/stores/draft.store';
import { User } from '@/features/users/types';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useAppStore } from '@/stores/app.store';
import { Media } from '@/types';
import { SHORTCUTS } from '@/types/shortcuts';
import { getMentionIdsFromHtml } from '@/utils/get-mention-ids-from-html';
import { useMutation } from '@tanstack/react-query';
import { Editor, EditorContent } from '@tiptap/react';
import { isEqual } from 'lodash';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from './actions';
import { AttachmentButton } from './attachment-button';
import { AttachmentSelection } from './attachment-selection';
import { EmojiButton } from './emoji-button';
import { useMediaUpload } from './media-upload';
import { MentionButton } from './mention-button';
import { MentionSuggestion } from './mention-suggestion-options';
import { MicButton, MicButtonRef } from './mic-button';
import { SendButton } from './send-button';
import { TranslationHelper, TranslationHelperRef } from './translation-helper';
import { useEditor } from './use-editor';
import { isMobile as isMobileDevice } from 'react-device-detect';
import BlockChatBar from './block-chat-bar';
export type MessageEditorSubmitData = {
  content: string;
  images: Media[];
  videos: Media[];
  documents: Media[];
  language?: string;
  mentions?: string[];
  enContent?: string | null;
};
export interface MessageEditorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onSubmitValue?: (data: MessageEditorSubmitData) => void;
  userMentions?: User[];
  onTypingChange?: (isTyping: boolean) => void;
  sendBtnProps?: ButtonProps;
  roomId?: string;
  isBlocked?: boolean;
  isEditing?: boolean;
  onEditSubmit?: (message: Message) => void;
  isMediaDisabled?: boolean;
}

export const MessageEditor = forwardRef<HTMLDivElement, MessageEditorProps>(
  (
    {
      onSubmitValue,
      userMentions = [],
      sendBtnProps,
      onTypingChange,
      roomId,
      isEditing,
      isBlocked = false,
      isMediaDisabled = false,
      onEditSubmit,
      ...props
    },
    ref,
  ) => {
    const { files, reset: filesReset, handleClipboardEvent } = useMediaUpload();
    const { t } = useTranslation('common');

    const [disabled, setDisabled] = useState(false);
    const setDraft = useDraftStore((s) => s.setDraft);

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
    const editorId = useId();
    const sendButtonId = useId();
    const editor = useEditor({
      placeholder: t('CONVERSATION.TYPE_A_MESSAGE'),
      onClipboardEvent: isMediaDisabled ? undefined : handleClipboardEvent,
      mentionSuggestions,
      onEnterTrigger: handleEnterTrigger,
      enterToSubmit: !isMobileDevice,
      onTypingChange,
      isEditing,
      id: roomId,
    });

    const translationHelperRef = useRef<TranslationHelperRef>(null);

    const micRef = useRef<MicButtonRef>(null);

    const isContentEmpty = editor?.getText().trim().length === 0;

    const reset = () => {
      filesReset();
      editor?.commands.clearContent();
      micRef.current?.stop();
      setDraft(roomId ?? '', '');
      translationHelperRef.current?.clearContent();
    };

    const handleSubmit = async () => {
      const images: Media[] = [];
      const documents: Media[] = [];
      const videos: Media[] = [];
      let content = editor?.getHTML() || '';
      let lang = translationHelperRef.current?.getSourceLang() || '';
      let english = translationHelperRef.current?.getEnContent();
      let mentions: string[] = [];
      reset();
      focus();
      if (!isContentEmpty) {
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
        language: lang,
        mentions: mentions,
        videos,
        enContent: english,
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
          ref={translationHelperRef}
          mentionSuggestionOptions={mentionSuggestions}
          editor={editor}
          onStartedEdit={() => setDisabled(true)}
          onFinishedEdit={() => {
            setDisabled(false);
            editor?.commands.focus('end');
          }}
          onSend={handleSubmit}
        />
        <div className="relative">
          {isEditing && editor && (
            <EditControl
              onEditSubmit={onEditSubmit}
              translationHelperRef={translationHelperRef}
              isContentEmpty={isContentEmpty}
              sendButtonId={sendButtonId}
              editor={editor}
            />
          )}
          <div className="relative flex gap-1">
            <div
              ref={ref}
              {...props}
              className="flex min-h-[82px] w-full flex-col rounded-xl border border-primary p-1 px-3 pb-3 shadow-sm"
            >
              <div className="-ml-2">
                {!isEditing && !isMediaDisabled && <AttachmentButton />}
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
              {!isEditing && <AttachmentSelection editor={editor} />}
            </div>

            <input
              className="absolute h-0 w-0 opacity-0"
              id={`input-${editorId}`}
              type="text"
            />
            {!isEditing && (
              <SendButton
                id={sendButtonId}
                onClick={(e) => {
                  handleSubmit();
                }}
                editor={editor}
                editorId={editorId}
                {...sendBtnProps}
              />
            )}
            {editor && !isMobile && <Autofocus editor={editor} />}
          </div>
          {disabled && (
            <div className="absolute left-0 top-0 h-full w-full bg-white opacity-80 max-md:text-sm" />
          )}
        </div>
      </>
    );
  },
);
MessageEditor.displayName = 'MessageEditor';

export const Autofocus = ({ editor }: { editor: Editor }) => {
  useEffect(() => {
    console.log('render Autofocus');
    editor?.commands.focus('end');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

const EditControl = ({
  sendButtonId,
  translationHelperRef,
  isContentEmpty,
  editor,
  onEditSubmit,
}: {
  sendButtonId: string;
  translationHelperRef: React.MutableRefObject<TranslationHelperRef | null>;
  isContentEmpty: boolean;
  editor: Editor;
  onEditSubmit?: (message: Message) => void;
}) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: messageApi.edit,
  });
  const { reset, message } = useMessageActions();
  const { t } = useTranslation('common');
  const handleSave = () => {
    let content = editor?.getHTML() || '';
    let english = translationHelperRef.current?.getEnContent();
    let language = translationHelperRef.current?.getSourceLang();
    let mentions: string[] = [];
    if (!isContentEmpty) {
      mentions = getMentionIdsFromHtml(content);
    } else content = '';
    mutate({
      id: message!._id,
      data: {
        content,
        mentions,
        enContent: english,
        language: language || '',
      },
    });
    const messageData = {
      _id: message!._id,
      content,
      status: 'edited',
    } as Message;
    if (language) {
      messageData.language = language;
    }
    if (english) {
      messageData.translations = {
        en: english,
      };
    }
    onEditSubmit && onEditSubmit(messageData);
    reset();
  };
  const isDirty = editor?.getHTML() !== message?.content;

  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="font-semibold text-neutral-800">
        {t('CONVERSATION.EDIT_MESSAGE')}
      </span>
      <div className="space-x-2">
        <Button
          onClick={reset}
          size="xs"
          shape="square"
          variant="ghost"
          color="default"
        >
          {t('COMMON.CANCEL')}
        </Button>
        <Button
          loading={isLoading}
          disabled={!isDirty || isContentEmpty}
          onClick={handleSave}
          id={sendButtonId}
          size="xs"
          shape="square"
        >
          {t('COMMON.SAVE')}
        </Button>
      </div>
    </div>
  );
};
