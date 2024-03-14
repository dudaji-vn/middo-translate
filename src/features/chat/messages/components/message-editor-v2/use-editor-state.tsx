import { useMediaUpload } from '@/components/media-upload';
import { Editor } from '@tiptap/react';
import { useCallback, useId, useRef, useState } from 'react';
import { MicToggleButtonRef } from './mic-toggle-button';
import { ToolbarRef } from './toolbar';

export const useEditorState = () => {
  const { files, reset } = useMediaUpload();

  const id = useId();

  const [translating, setTranslating] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [isContentEmpty, setIsContentEmpty] = useState<boolean>(true);

  const [content, setContent] = useState<string>('');
  const [contentEnglish, setContentEnglish] = useState<string>('');
  const [srcLang, setSrcLang] = useState<string | null>(null);
  const [richText, setRichText] = useState<Editor | null>(null);

  const micToggleButtonRef = useRef<MicToggleButtonRef>(null);
  const toolbarRef = useRef<ToolbarRef>(null);
  const resetEditor = () => {
    micToggleButtonRef.current?.stop();
    richText?.commands.clearContent();
    setContent('');
    setIsContentEmpty(true);
    reset();
    setContentEnglish('');
    setSrcLang(null);
  };
  const setTextContent = useCallback(
    (text: string) => {
      richText?.commands.clearContent();
      richText?.commands.insertContent({
        type: 'text',
        text: text,
      });
    },
    [richText],
  );

  return {
    files,
    reset: resetEditor,
    id,
    translating,
    setTranslating,
    inputDisabled,
    setInputDisabled,
    isContentEmpty,
    setIsContentEmpty,
    content,
    setContent,
    contentEnglish,
    setContentEnglish,
    srcLang,
    setSrcLang,
    richText,
    setRichText,
    micToggleButtonRef,
    toolbarRef,
    setTextContent,
  };
};
