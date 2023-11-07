import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { useAdjustTextStyle } from '@/hooks/use-adjust-text-style';

export interface TranslateResultProps {
  result: string;
  languageCode?: string;
  children?: React.ReactNode;
}

export const TranslateResult = ({
  result,
  languageCode,
  children,
}: TranslateResultProps) => {
  const textStyle = useAdjustTextStyle(result);
  return (
    <TranslateEditorWrapper
      type="result"
      topElement={children}
      languageCode={languageCode}
    >
      <div className={`translatedText ${textStyle} break-words`}>{result}</div>
    </TranslateEditorWrapper>
  );
};
