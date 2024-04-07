import { Button } from '@/components/actions';
import { Mic } from 'lucide-react';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useAuthStore } from '@/stores/auth.store';
import {
  DEFAULT_LANGUAGES_CODE,
  SUPPORTED_VOICE_MAP,
} from '@/configs/default-language';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import useSpeechRecognizer from '@/hooks/use-speech-recognizer';
import { Editor } from '@tiptap/react';
export interface MicButtonProps {
  className?: string;
  editor: Editor | null;
}
export interface MicButtonRef {
  stop: () => void;
}

export const MicButton = forwardRef<MicButtonRef, MicButtonProps>(
  ({ editor, ...props }, ref) => {
    const lang =
      useAuthStore((s) => s.user?.language) ?? DEFAULT_LANGUAGES_CODE.EN;
    const [transcribing, setTranscribing] = useState(false);
    const enableTranscribing = () => setTranscribing(true);
    const disableTranscribing = () => setTranscribing(false);

    const {
      listening,
      interimTranscript,
      startSpeechToText,
      stopSpeechToText,
    } = useSpeechRecognizer(
      SUPPORTED_VOICE_MAP[(lang || 'auto') as keyof typeof SUPPORTED_VOICE_MAP],
    );
    const setTextContent = useCallback(
      (text: string) => {
        editor?.commands.clearContent();
        editor?.commands.insertContent({
          type: 'text',
          text: text,
        });
      },
      [editor?.commands],
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
      listening ? handleStopListening() : handleStartListening();
    };

    useEffect(() => {
      if (interimTranscript && listening) {
        setTextContent(interimTranscript);
      }
    }, [interimTranscript, listening, setTextContent]);

    useImperativeHandle(ref, () => ({
      stop: handleStopListening,
    }));

    useKeyboardShortcut([SHORTCUTS.START_STOP_SPEECH_TO_TEXT], (e) => {
      handleToggleListening();
      e?.preventDefault();
    });

    return (
      <Button.Icon
        onClick={handleToggleListening}
        variant="ghost"
        size="xs"
        color={listening && transcribing ? 'primary' : 'default'}
        {...props}
      >
        <Mic />
      </Button.Icon>
    );
  },
);

MicButton.displayName = 'MicButton';
