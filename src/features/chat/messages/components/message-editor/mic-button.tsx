import { Button } from '@/components/actions';
import { Mic, Square } from 'lucide-react';

import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';
import { useMSEditorStore } from '@/features/chat/stores/editor-language.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import useSpeechRecognizer from '@/hooks/use-speech-recognizer';
import { SHORTCUTS } from '@/types/shortcuts';
import { Editor } from '@tiptap/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
export interface MicButtonProps {
  className?: string;
  editor: Editor | null;
  onListeningChange?: (listening: boolean) => void;
}
export interface MicButtonRef {
  stop: () => void;
  isListening: boolean;
}

export const MicButton = forwardRef<MicButtonRef, MicButtonProps>(
  ({ editor, onListeningChange, ...props }, ref) => {
    const { languageCode, detectedLanguage } = useMSEditorStore(
      (state) => state,
    );
    const lang = languageCode === 'auto' ? detectedLanguage : languageCode;
    const [transcribing, setTranscribing] = useState(false);
    const enableTranscribing = () => setTranscribing(true);
    const disableTranscribing = () => setTranscribing(false);
    const { postMessage } = useReactNativePostMessage();
    const hasContent = editor?.getText().trim().length !== 0;

    const {
      listening,
      interimTranscript,
      startSpeechToText,
      stopSpeechToText,
    } = useSpeechRecognizer(
      SUPPORTED_VOICE_MAP[(lang || 'auto') as keyof typeof SUPPORTED_VOICE_MAP],
    );
    const haveEditor = editor !== null;
    const setTextContent = useCallback(
      (text: string) => {
        editor?.commands.clearContent();
        editor?.commands.insertContent({
          type: 'text',
          text: text,
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [haveEditor],
    );

    const handleStartListening = () => {
      enableTranscribing();
      startSpeechToText();
      editor?.commands.clearContent();
    };

    const handleStopListening = useCallback(() => {
      disableTranscribing();
      if (listening) {
        stopSpeechToText();
      }
    }, [listening, stopSpeechToText]);

    const handleToggleListening = () => {
      postMessage({
        type: 'Trigger',
        data: { type: 'mic', value: !listening },
      });
      listening ? handleStopListening() : handleStartListening();
    };

    useEffect(() => {
      if (interimTranscript && listening) {
        setTextContent(interimTranscript);
      }
    }, [interimTranscript, listening, setTextContent]);

    useEffect(() => {
      onListeningChange?.(listening);
    }, [listening]);

    useImperativeHandle(ref, () => ({
      stop: handleStopListening,
      isListening: listening,
    }));

    useKeyboardShortcut([SHORTCUTS.START_STOP_SPEECH_TO_TEXT], (e) => {
      handleToggleListening();
      e?.preventDefault();
    });

    if (hasContent && !listening) {
      return null;
    }

    return (
      <Button.Icon
        onClick={handleToggleListening}
        variant={listening ? 'default' : 'ghost'}
        size="xs"
        color={listening && transcribing ? 'secondary' : 'default'}
        {...props}
      >
        {listening ? <Square fill="currentColor" /> : <Mic />}
      </Button.Icon>
    );
  },
);

MicButton.displayName = 'MicButton';
