import { TranslateTool } from './translate-tool';
import { useChatStore } from '@/features/chat/store';
import { useMessageEditorText } from './message-editor-text-context';

export interface MessageEditorToolbarTranslateToolProps {}

export const MessageEditorToolbarTranslateTool = (
  props: MessageEditorToolbarTranslateToolProps,
) => {
  const {
    handleMiddleTranslate,
    text,
    translatedText,
    middleText,
    setMiddleText,
    setInputDisabled,
    inputDisabled,
    focusInput,
    isTranslating,
  } = useMessageEditorText();
  const { setSrcLang, detLang, srcLang } = useChatStore((s) => s);

  const { showTranslateOnType, toggleShowTranslateOnType } = useChatStore();
  return (
    <TranslateTool
      showTool={!!showTranslateOnType && !!text && srcLang !== 'en'}
      checked={showTranslateOnType}
      onCheckedChange={toggleShowTranslateOnType}
      content={translatedText}
      isEditing={!!middleText}
      middleText={middleText}
      setMiddleText={setMiddleText}
      loading={isTranslating}
      onEditStateChange={(isEditing) => {
        setInputDisabled(isEditing);
        if (inputDisabled) {
          focusInput();
        }
      }}
      onCancel={() => {
        setMiddleText('');
        setInputDisabled(false);
      }}
      onConfirm={() => {
        handleMiddleTranslate();
        setInputDisabled(false);
      }}
      onEdit={() => {
        setMiddleText(translatedText);
        setInputDisabled(true);
        setSrcLang(detLang);
      }}
    />
  );
};
