'use client';
import '@/components/tiptap/styles.css';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { ROUTE_NAMES } from '@/configs/route-name';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
type RichTextViewProps = {
  content: string;
  editorStyle?: string;
};

export const RichTextView = ({ content, editorStyle }: RichTextViewProps) => {
  const editor = useEditor({
    editable: false,
    editorProps: {
      attributes: {
        class: `prose editorView max-w-none w-full focus:outline-none text-current ${editorStyle}`,
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
          return [
            'a',
            {
              class: 'mention',
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
  }, [content, editor]);

  return <EditorContent editor={editor} />;
};
