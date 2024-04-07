'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

const Tiptap = () => {
  const [created, setCreated] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    onCreate: ({ editor }) => {
      console.log('editor created');
      setCreated(true);
    },
    content: '<p>Hello World! 🌎️</p>',
  });

  useEffect(() => {
    if (created) {
      editor?.commands.focus('end');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [created]);

  return <EditorContent editor={editor} />;
};

export default Tiptap;
