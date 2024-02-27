import { Button } from '@/components/actions';
import { ButtonProps } from '@/components/actions/button';
import { Mic } from 'lucide-react';
import { useChatStore } from '@/features/chat/store';
import { useMessageEditorText } from './message-editor-text-context';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { on } from 'events';
import { useCallback } from 'react';
import { SHORTCUTS } from '@/types/shortcuts';

export const MessageEditorToolbarMic = (props: ButtonProps) => {
  const { listening, handleStopListening, handleStartListening, userLanguage } =
    useMessageEditorText();
  console.log('listening', listening);
  const { setSrcLang, srcLang } = useChatStore((s) => s);

  const onStartListening = useCallback(() => {
    if (srcLang === 'auto') {
      setSrcLang(userLanguage);
      handleStartListening(userLanguage);
    } else {
      handleStartListening();
    }
  }, [handleStartListening, setSrcLang, srcLang, userLanguage]);

  useKeyboardShortcut([SHORTCUTS.START_STOP_SPEECH_TO_TEXT], (e) => {
    listening ? handleStopListening() : onStartListening();
    e?.preventDefault();
  });

  return (
    <>
      {listening ? (
        <Button.Icon
          onClick={handleStopListening}
          variant="ghost"
          size="xs"
          color="primary"
          {...props}
        >
          <Mic />
        </Button.Icon>
      ) : (
        <Button.Icon
          onClick={onStartListening}
          variant="ghost"
          size="xs"
          color="default"
          {...props}
        >
          <Mic />
        </Button.Icon>
      )}
    </>
  );
};
