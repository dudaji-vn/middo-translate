import { Button } from '@/components/actions';
import { Mic } from 'lucide-react';
import { useChatStore } from '@/features/chat/store';
import { useMessageEditorText } from './message-editor-text-context';

export interface MessageEditorToolbarMicProps {}

export const MessageEditorToolbarMic = (
  props: MessageEditorToolbarMicProps,
) => {
  const {
    listening,
    handleStopListening,
    handleStartListening,

    userLanguage,
  } = useMessageEditorText();
  const { setSrcLang, srcLang } = useChatStore((s) => s);

  return (
    <>
      {listening ? (
        <Button.Icon
          onClick={handleStopListening}
          variant="ghost"
          size="xs"
          color="primary"
        >
          <Mic />
        </Button.Icon>
      ) : (
        <Button.Icon
          onClick={() => {
            if (srcLang === 'auto') {
              setSrcLang(userLanguage);
              handleStartListening(userLanguage);
            } else {
              handleStartListening();
            }
          }}
          variant="ghost"
          size="xs"
          color="default"
        >
          <Mic />
        </Button.Icon>
      )}
    </>
  );
};
