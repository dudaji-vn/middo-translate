import { useMediaUpload } from '@/components/media-upload';
import { MentionSuggestion } from '@/components/mention-suggestion-options';
import { useAppStore } from '@/stores/app.store';
import { useMessageEditor } from '.';
import { RichTextInput } from './rich-text-input';

export interface MainInputProps {}

let isTyping = false;

export const MainInput = (props: MainInputProps) => {
  const isMobile = useAppStore((state) => state.isMobile);

  const { handleClipboardEvent } = useMediaUpload();
  const {
    setRichText,
    editorId,
    setContent,
    toolbarRef,
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

  return (
    <RichTextInput
      className="max-h-[200px] w-full overflow-y-auto pt-2 md:pt-1"
      autoFocus={false}
      suggestions={suggestions}
      onClipboardEvent={handleClipboardEvent}
      onCreated={setRichText}
      onChange={(editor) => {
        setContent(editor.getHTML());
      }}
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
      onSubmit={() => {
        const submitButton = document.getElementById('send-button-' + editorId);
        submitButton?.click();
      }}
      // onFocus={() => {
      //   if (isMobile) toolbarRef?.current?.collapse();
      // }}
      // onBlur={() => {
      //   toolbarRef?.current?.expand();
      // }}
    />
  );
};
