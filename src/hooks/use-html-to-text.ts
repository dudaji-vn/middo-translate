import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
export const useHtmlToText = (html: string) => {
  const editor = useEditor({
    editable: false,
    content: html,
    extensions: [StarterKit],
  });
  return editor?.getText() ?? '';
};
