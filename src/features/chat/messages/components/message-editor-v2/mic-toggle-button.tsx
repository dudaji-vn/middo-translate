import { Button } from '@/components/actions';
import { Mic } from 'lucide-react';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useMessageEditor } from '.';
import { useAuthStore } from '@/stores/auth.store';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
export interface MicToggleButtonProps {
  className?: string;
}
export interface MicToggleButtonRef {
  stop: () => void;
}

export const MicToggleButton = forwardRef<
  MicToggleButtonRef,
  MicToggleButtonProps
>((props, ref) => {
  const { setTextContent } = useMessageEditor();
  const [transcribing, setTranscribing] = useState(false);
  const enableTranscribing = () => setTranscribing(true);
  const disableTranscribing = () => setTranscribing(false);

  const { listening, interimTranscript } = useSpeechRecognition({
    transcribing: transcribing,
  });

  const lang =
    useAuthStore((s) => s.user?.language) ?? DEFAULT_LANGUAGES_CODE.EN;

  const handleStartListening = () => {
    enableTranscribing();
    SpeechRecognition.startListening({
      language: lang,
      continuous: true,
      interimResults: true,
    });
  };

  const handleStopListening = useCallback(() => {
    disableTranscribing();
    if (listening) {
      SpeechRecognition.stopListening();
    }
  }, [listening]);

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
});

MicToggleButton.displayName = 'MicToggleButton';
