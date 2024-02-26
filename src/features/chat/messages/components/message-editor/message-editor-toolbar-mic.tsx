import { Button } from '@/components/actions';
import { Mic } from 'lucide-react';
import { useChatStore } from '@/features/chat/store';
import { useMessageEditorText } from './message-editor-text-context';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { on } from 'events';
import { useCallback } from 'react';
import { SHORTCUTS } from '@/types/shortcuts';

export interface MessageEditorToolbarMicProps {}

export const MessageEditorToolbarMic = (
  props: MessageEditorToolbarMicProps,
) => {
  const { listening, handleStopListening, handleStartListening, userLanguage } =
    useMessageEditorText();
  const { setSrcLang, srcLang } = useChatStore((s) => s);

  const onStartListening = useCallback(() => {
    if (srcLang === 'auto') {
      setSrcLang(userLanguage);
      handleStartListening(userLanguage);
    } else {
      handleStartListening();
    }
  }, [handleStartListening, setSrcLang, srcLang, userLanguage]);

  useKeyboardShortcut([SHORTCUTS.START_STOP_SPEECH_TO_TEXT], (e) =>{
    listening ? handleStopListening() : onStartListening();
    e?.preventDefault();}
  );

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
          onClick={onStartListening}
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
