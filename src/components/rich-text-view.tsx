'use client';
import '@/components/tiptap/styles.css';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { ROUTE_NAMES } from '@/configs/route-name';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
type RichTextViewProps = {
  content: string;
  editorStyle?: string;
  onCreated?: (editor: Editor) => void;
  mentionClassName?: string;
};

export const RichTextView = ({
  content,
  editorStyle = '',
  onCreated,
  mentionClassName = '',
}: RichTextViewProps) => {
  const userId = useAuthStore((state) => state.user?._id);
  const editor = useEditor({
    editable: false,
    editorProps: {
      attributes: {
        class: `prose editor-view prose-strong:text-current max-w-none w-full focus:outline-none text-current text-sm ${editorStyle}`,
      },
    },
    content,
    extensions: [
      StarterKit,
      Link.configure({
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          protocols: [
            {
              scheme: 'tel',
              optionalSlashes: true,
            },
          ],
          class: 'link',
          rel: 'noopener noreferrer',
        },
      }),
      Mention.configure({
        renderHTML(props) {
          const { node } = props;
          const extendClass = node.attrs.id === userId ? 'me' : '';
          return [
            'a',
            {
              target: '_self',
              class: `mention ${mentionClassName} ${extendClass}`,
              'data-type': 'mention',
              'data-id': node.attrs.id,
              href: `${ROUTE_NAMES.ONLINE_CONVERSATION}/${node.attrs.id}`,
            },

            `@${node.attrs.label}`,
          ];
        },
      }),
    ],
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(content);
    onCreated?.(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editor]);

  return <EditorContent editor={editor} />;
};
