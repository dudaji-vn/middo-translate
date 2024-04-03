import { EnterToSubmit } from '@/components/enter-to-submit';
import {
  MentionSuggestion,
  mentionSuggestionOptions,
} from '@/components/mention-suggestion-options';
import { usePlatformStore } from '@/features/platform/stores';
import { useAppStore } from '@/stores/app.store';
import Emoji, { gitHubEmojis } from '@tiptap-pro/extension-emoji';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { useTranslation } from 'react-i18next';

let typingTimeout: any = null;
export interface RichTextInputProps {
  className?: string;
  onClipboardEvent?: (e: ClipboardEvent) => void;
  onCreated?: (editor: Editor) => void;
  onSubmit?: () => void;
  onChange?: (editor: Editor) => void;
  initialContent?: string;
  autoFocus?: boolean;
  onBlur?: (editor?: Editor) => void;
  onFocus?: (editor?: Editor) => void;
  suggestions?: MentionSuggestion[];
  onTyping?: (isTyping: boolean) => void;
  onStoppedTyping?: (isTyping: boolean) => void;
}

const RichTextInput = ({
  className,
  onClipboardEvent,
  onCreated,
  onSubmit,
  onChange,
  initialContent,
  autoFocus = false,
  onBlur,
  onFocus,
  onTyping,
  onStoppedTyping,
  suggestions = [],
}: RichTextInputProps) => {
  const { t } = useTranslation('common');
  const isMobile = usePlatformStore((state) => state.platform === 'mobile');
  const editor = useEditor({
    editorProps: {
      transformPastedHTML(html) {
        return html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
      },
      attributes: {
        class: 'prose max-w-none w-full focus:outline-none',
      },
      handlePaste: (_, e) => {
        onClipboardEvent?.(e);
      },
    },

    autofocus: autoFocus ? 'end' : false,
    onCreate: ({ editor }) => {
      onCreated?.(editor as Editor);
    },
    onBlur: ({ editor }) => {
      onBlur?.(editor as Editor);
    },
    onFocus: ({ editor }) => {
      onFocus?.(editor as Editor);
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: t('CONVERSATION.TYPE_A_MESSAGE'),
      }),
      Link.configure({
        validate: (href) => /^https?:\/\//.test(href),
        protocols: [
          {
            scheme: 'tel',
            optionalSlashes: true,
          },
        ],
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          className: 'link',
          style: 'color: #007bff',
        },
      }),
      Mention.configure({
        renderHTML(props) {
          const { node } = props;
          return [
            'span',
            {
              class: 'mention',
              'data-type': 'mention',
              'data-id': node.attrs.id,
              'data-label': node.attrs.label,
            },

            `@${node.attrs.label}`,
          ];
        },
        suggestion: mentionSuggestionOptions(suggestions ?? []),
      }),
      // if not mobile, enable enter to submit

      isMobile
        ? (null as any)
        : EnterToSubmit.configure({
            onSubmit: () => {
              onSubmit?.();
            },
          }),
      ,
      Emoji.configure({
        enableEmoticons: true,
        emojis: gitHubEmojis,
      }),
    ],
    onUpdate: ({ editor }) => {
      onChange?.(editor as Editor);
      if (editor.getText().length > 0) {
        onTyping?.(true);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          onStoppedTyping?.(false);
        }, 1000); // Adjust timeout as needed
      } else {
        onStoppedTyping?.(false);
        clearTimeout(typingTimeout);
      }
    },
    content: initialContent,
  });
  return <EditorContent className={className} editor={editor} />;
};

const RichTextInputMemo = React.memo(RichTextInput);

export { RichTextInputMemo as RichTextInput };
