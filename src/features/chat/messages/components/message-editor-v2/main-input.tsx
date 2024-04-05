import { useMediaUpload } from '@/components/media-upload';
import { MentionSuggestion } from '@/components/mention-suggestion-options';
import { useMessageEditor } from '.';
import { RichTextInput } from './rich-text-input';
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { useAppStore } from '@/stores/app.store';

export interface MainInputProps {}

let isTyping = false;

export const MainInput = (props: MainInputProps) => {
  const { handleClipboardEvent } = useMediaUpload();
  const isMobile = useAppStore((state) => state.isMobile);
  const {
    setRichText,
    editorId,
    setContent,
    userMentions,
    onStoppedTyping,
    onTyping,
  } = useMessageEditor();
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

  const handleSubmit = useCallback(() => {
    const submitButton = document.getElementById('send-button-' + editorId);
    submitButton?.click();
  }, [editorId]);

  const handleChange = useCallback((editor: Editor) => {
    setContent(editor.getHTML());
    setRichText((prev) => {
      if (prev === null) {
        return editor;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RichTextInput
      className="max-h-[200px] w-full overflow-y-auto pt-2 md:pt-1"
      autoFocus={!isMobile}
      suggestions={suggestions}
      onClipboardEvent={handleClipboardEvent}
      onChange={handleChange}
      onTyping={(value) => {
        if (!isTyping) {
          onTyping?.(value);
        }
        isTyping = true;
      }}
      onStoppedTyping={(value) => {
        if (isTyping) {
          onStoppedTyping?.(value);
        }
        isTyping = false;
      }}
      onSubmit={handleSubmit}
    />
  );
};
