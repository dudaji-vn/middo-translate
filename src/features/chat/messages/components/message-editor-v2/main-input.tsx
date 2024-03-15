import { useMediaUpload } from '@/components/media-upload';
import { MentionSuggestion } from '@/components/mention-suggestion-options';
import { useAppStore } from '@/stores/app.store';
import { useMessageEditor } from '.';
import { RichTextInput } from './rich-text-input';

export interface MainInputProps {}

export const MainInput = (props: MainInputProps) => {
  const isMobile = useAppStore((state) => state.isMobile);

  const { handleClipboardEvent } = useMediaUpload();
  const {
    setRichText,
    editorId,
    setContent,
    setIsContentEmpty,
    toolbarRef,
    userMentions,
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
      autoFocus={false}
      suggestions={suggestions}
      onClipboardEvent={handleClipboardEvent}
      className="max-h-[200px] w-full overflow-y-auto pt-2 md:pt-1"
      onCreated={setRichText}
      onChange={(editor) => {
        setContent(editor.getHTML());
        setIsContentEmpty(editor.isEmpty);
      }}
      onSubmit={() => {
        const submitButton = document.getElementById('send-button-' + editorId);
        submitButton?.click();
      }}
      onFocus={() => {
        if (isMobile) toolbarRef?.current?.collapse();
      }}
      onBlur={() => {
        toolbarRef?.current?.expand();
      }}
    />
  );
};
