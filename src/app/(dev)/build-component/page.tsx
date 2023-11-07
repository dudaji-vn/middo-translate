import { SpeechToText } from '@/components/speech-to-text';

interface BuildComponent {
  searchParams: {
    query?: string;
    sourceLanguage?: string;
    targetLanguage?: string;
  };
}

export default async function BuildComponent(props: BuildComponent) {
  return (
    <div>
      <SpeechToText />
    </div>
  );
}
