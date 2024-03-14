import { EnterToSubmit } from '@/components/enter-to-submit';
import {
  MentionSuggestion,
  mentionSuggestionOptions,
} from '@/components/mention-suggestion-options';
import Emoji, { gitHubEmojis } from '@tiptap-pro/extension-emoji';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
}

export const RichTextInput = ({
  className,
  onClipboardEvent,
  onCreated,
  onSubmit,
  onChange,
  initialContent,
  autoFocus = false,
  onBlur,
  onFocus,
  suggestions = [],
}: RichTextInputProps) => {
  const editor = useEditor({
    editorProps: {
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
        placeholder: 'Type a message',
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
      EnterToSubmit.configure({
        onSubmit: () => {
          onSubmit?.();
        },
      }),
      Emoji.configure({
        enableEmoticons: true,
        emojis: gitHubEmojis,
      }),
    ],
    onUpdate: ({ editor }) => {
      onChange?.(editor as Editor);
    },
    content: initialContent,
  });
  return <EditorContent className={className} editor={editor} />;
};
