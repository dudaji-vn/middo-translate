import { TranslateTool } from './translate-tool';
import { useChatStore } from '@/features/chat/store';

export interface MessageEditorToolbarTranslateToolProps {}

export const MessageEditorToolbarTranslateTool = (
  props: MessageEditorToolbarTranslateToolProps,
) => {
  //
  const { setSrcLang, detLang, srcLang } = useChatStore((s) => s);

  const { showTranslateOnType, toggleShowTranslateOnType } = useChatStore();
  return (
    <div></div>
    // <TranslateTool
    //   showTool={!!showTranslateOnType && !!text && srcLang !== 'en'}
    //   checked={showTranslateOnType}
    //   onCheckedChange={toggleShowTranslateOnType}
    //   content={translatedText}
    //   isEditing={!!middleText}
    //   middleText={middleText}
    //   setMiddleText={setMiddleText}
    //   loading={isTranslating}
    //   onEditStateChange={(isEditing) => {
    //     setInputDisabled(isEditing);
    //     if (inputDisabled) {
    //       focusInput();
    //     }
    //   }}
    //   onCancel={() => {
    //     setMiddleText('');
    //     setInputDisabled(false);
    //   }}
    //   onConfirm={() => {
    //     handleMiddleTranslate();
    //     setInputDisabled(false);
    //   }}
    //   onEdit={() => {
    //     setMiddleText(translatedText);
    //     setInputDisabled(true);
    //     setSrcLang(detLang);
    //   }}
    // />
  );
};
