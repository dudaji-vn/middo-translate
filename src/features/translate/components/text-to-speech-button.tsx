import { Button } from '@/components/actions';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { PauseIcon, Volume2Icon } from 'lucide-react';
import { forwardRef } from 'react';
export interface TextToSpeechButtonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  languageCode?: string;
  text?: string;
  shortcut?: string[];
}

export const TextToSpeechButton = forwardRef<
  HTMLDivElement,
  TextToSpeechButtonProps
>(({ languageCode, text, shortcut }, ref) => {
  const { isPlaying, speak, stop } = useTextToSpeech(languageCode, text);
  if (isPlaying) {
    return (
      <Button.Icon
        onClick={() => {
          stop();
        }}
        variant="ghost"
        color="primary"
        size="xs"
      >
        <PauseIcon />
      </Button.Icon>
    );
  }
  return (
    <Button.Icon
      onClick={() => {
        speak();
      }}
      disabled={!text}
      variant="ghost"
      color="primary"
      size="xs"
    >
      <Volume2Icon />
    </Button.Icon>
  );
});
TextToSpeechButton.displayName = 'TextToSpeechButton';
