import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { useAdjustTextStyle } from '@/hooks/use-adjust-text-style';

export interface TranslateResultProps {
  result: string;
  status?: 'correct' | 'error';
  languageCode?: string;
  resultEnglish: string;
}

export const TranslateResult = ({
  result,
  status = 'correct',
  languageCode,
  resultEnglish,
}: TranslateResultProps) => {
  const textStyle = useAdjustTextStyle(result);
  return (
    <TranslateEditorWrapper type="result" languageCode={languageCode}>
      <div className={`translatedText ${textStyle} break-words`}>{result}</div>
      <div
        className={`translateResultText bottomResultText break-words first-letter:uppercase`}
      >
        {resultEnglish}
      </div>
    </TranslateEditorWrapper>
  );
};
