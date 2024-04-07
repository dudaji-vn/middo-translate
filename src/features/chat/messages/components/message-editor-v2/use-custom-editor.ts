import { EnterToSubmit } from '@/components/enter-to-submit';
import { mentionSuggestionOptions } from '@/components/mention-suggestion-options';
import { useAppStore } from '@/stores/app.store';
import Emoji, { gitHubEmojis } from '@tiptap-pro/extension-emoji';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTranslation } from 'react-i18next';

export interface useCustomEditorProps {}

export const useCustomEditor = () => {
  const { t } = useTranslation('common');
  const isMobile = useAppStore((s) => s.isMobile);
  const editor = useEditor({
    editorProps: {
      transformPastedHTML(html) {
        return html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
      },
      attributes: {
        class: 'prose max-w-none w-full focus:outline-none',
      },
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
        // suggestion: mentionSuggestionOptions(suggestions ?? []),
      }),
      isMobile
        ? (null as any)
        : EnterToSubmit.configure({
            onSubmit: () => {
              // onSubmit?.();
            },
          }),
      ,
      Emoji.configure({
        enableEmoticons: true,
        emojis: gitHubEmojis,
      }),
    ],
    // onUpdate: ({ editor }) => {
    //   onChange?.(editor as Editor);
    //   if (editor.getText().length > 0) {
    //     onTyping?.(true);
    //     clearTimeout(typingTimeout);
    //     typingTimeout = setTimeout(() => {
    //       onStoppedTyping?.(false);
    //     }, 1000); // Adjust timeout as needed
    //   } else {
    //     onStoppedTyping?.(false);
    //     clearTimeout(typingTimeout);
    //   }
    // },
    // content: initialContent,
  });
  return { editor };
};
