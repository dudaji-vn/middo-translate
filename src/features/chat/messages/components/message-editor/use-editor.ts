import Emoji, { gitHubEmojis } from '@tiptap-pro/extension-emoji';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { EnterToSubmit } from './enter-to-submit';
import {
  MentionSuggestion,
  mentionSuggestionOptions,
} from './mention-suggestion-options';
import { useEffect, useRef } from 'react';
import { useDraftStore } from '@/features/chat/stores/draft.store';

import { convert } from 'html-to-text';
import { useMessageActions } from '../message-actions';
type UseEditorOptions = {
  enterToSubmit?: boolean;
  onClipboardEvent?: (e: ClipboardEvent) => void;
  placeholder?: string;
  onEnterTrigger?: () => void;
  mentionSuggestions: MentionSuggestion[];
  onTypingChange?: (isTyping: boolean) => void;
  id?: string;
  isEditing?: boolean;
  editorId?: string;
};
export const useEditor = ({
  enterToSubmit = true,
  onClipboardEvent,
  placeholder,
  onEnterTrigger,
  mentionSuggestions,
  onTypingChange,
  id,
  isEditing,
}: UseEditorOptions) => {
  const typingTimeout = useRef<any>(null);
  const isTyping = useRef(false);
  const setDraft = useDraftStore((s) => s.setDraft);
  const { message } = useMessageActions();
  const editor = useTiptapEditor(
    {
      editorProps: {
        transformPastedHTML(html) {
          if (html.includes(`<meta charset='utf-8'><a href=`)) {
            return extractUrl(html);
          }
          return convert(html);
        },

        attributes: {
          class:
            'prose max-w-none w-full focus:outline-none dark:text-neutral-50 message-editor',
        },
        handlePaste: (_, e) => {
          onClipboardEvent?.(e);
        },
      },
      onUpdate: ({ editor }) => {
        if (isEditing) return;
        if (editor.getText().length > 0) {
          setDraft(id ?? '', editor.getHTML());
          if (!isTyping.current) {
            onTypingChange?.(true);
            isTyping.current = true;
          }
          clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(() => {
            onTypingChange?.(false);
            isTyping.current = false;
          }, 1000); // Adjust timeout as needed
        } else {
          onTypingChange?.(false);
          isTyping.current = false;
          clearTimeout(typingTimeout.current);
          setDraft(id ?? '', '');
        }
      },
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder,
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
            class: 'link',
          },
        }),
        enterToSubmit
          ? EnterToSubmit.configure({
              onSubmit: onEnterTrigger,
            })
          : (null as any),
        Emoji.configure({
          enableEmoticons: true,
          emojis: gitHubEmojis,
          HTMLAttributes: {
            contenteditable: true,
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
                contenteditable: true,
              },

              `@${node.attrs.label}`,
            ];
          },
          suggestion: mentionSuggestionOptions(mentionSuggestions),
        }),
      ],
      content: '',
    },
    [mentionSuggestions?.length],
  );
  useEffect(() => {
    if (!editor) return;
    if (isEditing) {
      editor.commands.setContent(message?.content ?? '');
      setTimeout(() => {
        editor.commands.focus('end');
      }, 500);
      return;
    }
    editor.commands.setContent(useDraftStore.getState().draft[id ?? ''] ?? '');
  }, [id, editor, isEditing, message?.content]);
  useEffect(() => {
    if (editor !== null && placeholder !== '') {
      editor.extensionManager.extensions.filter(
        (extension) => extension.name === 'placeholder',
      )[0].options['placeholder'] = placeholder;
      editor.view.dispatch(editor.state.tr);
    }
  }, [editor, placeholder]);
  return editor;
};

function extractUrl(html: string) {
  const regex = /<a href="(.*?)"/;
  const match = html.match(regex);
  return match ? match[1] : html;
}
