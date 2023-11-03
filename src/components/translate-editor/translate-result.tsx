import { TranslateEditorWrapper } from './translate-editor-wrapper';
import { useAdjustTextStyle } from '@/hooks/use-adjust-text-style';

export interface TranslateResultProps {
  result: string;
  status?: 'correct' | 'error';
  languageCode?: string;
  resultEnglish: string;
}

export const TranslateResult = (props: TranslateResultProps) => {
  const textStyle = useAdjustTextStyle(props.result);
  return (
    <TranslateEditorWrapper type="result" languageCode={props.languageCode}>
      <div className={`translatedText ${textStyle} break-words`}>
        {props.result}
      </div>
      <div
        className={`translateResultText break-words first-letter:uppercase ${props.status}`}
      >
        {props.resultEnglish}
      </div>
    </TranslateEditorWrapper>
  );
};
