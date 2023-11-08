import {
  CompareBar,
  TranslateEditor,
  TranslateMiddle,
  TranslateMiddleEditor,
  TranslateResult,
} from '@/components/translate-editor';
import { detectLanguage, translateText } from '@/services/languages';

import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { LanguagesControlBar } from '@/components/languages-control-bar';
import { TranslateOptionBar } from '@/components/translate-option-bar';

interface HomeProps {
  searchParams: {
    query?: string;
    source?: string;
    target?: string;
    edit?: string;
    mquery?: string;
    detect?: string;
    listening?: string;
  };
}

export default async function Home(props: HomeProps) {
  const isEdit = props.searchParams.edit === 'true';
  const sourceText = props.searchParams.query || '';
  const middleText = props.searchParams.mquery || '';
  const isListening = props.searchParams.listening === 'true';

  const sourceLanguage =
    props.searchParams.source === 'auto'
      ? props.searchParams.detect && middleText
        ? props.searchParams.detect
        : await detectLanguage(sourceText)
      : props.searchParams.source;
  const targetLanguage = props.searchParams.target;
  const targetResult = middleText
    ? await translateText(middleText, DEFAULT_LANGUAGES_CODE.EN, targetLanguage)
    : await translateText(sourceText, sourceLanguage, targetLanguage);
  const sourceEnglishResult = middleText
    ? middleText
    : await translateText(
        sourceText,
        sourceLanguage,
        DEFAULT_LANGUAGES_CODE.EN,
      );
  const targetEnglishResult = middleText
    ? middleText
    : await translateText(
        targetResult,
        targetLanguage,
        DEFAULT_LANGUAGES_CODE.EN,
      );

  const sourceTranslateResult = middleText
    ? await translateText(
        middleText,
        DEFAULT_LANGUAGES_CODE.EN,
        props.searchParams.detect ? props.searchParams.detect : sourceLanguage,
      )
    : '';

  return (
    <main className="flex h-full w-full flex-col gap-5 px-5">
      <LanguagesControlBar
        source={sourceLanguage}
        target={targetLanguage}
        detect={props.searchParams.source === 'auto' ? sourceLanguage : ''}
      />
      <TranslateEditor
        disabled={isEdit}
        isListening={isListening}
        isDetect={props.searchParams.source === 'auto'}
        languageCode={sourceLanguage}
        sourceTranslateResult={sourceTranslateResult}
        className={sourceText || sourceTranslateResult ? '' : 'min-h-[40vh]'}
      >
        {sourceEnglishResult &&
          !isEdit &&
          targetLanguage !== DEFAULT_LANGUAGES_CODE.EN &&
          sourceLanguage !== DEFAULT_LANGUAGES_CODE.EN && (
            <TranslateMiddle
              text={sourceEnglishResult}
              textCompare={targetEnglishResult}
            />
          )}
        {isEdit && <TranslateMiddleEditor defaultText={sourceEnglishResult} />}
      </TranslateEditor>

      {!isEdit && sourceEnglishResult && targetEnglishResult ? (
        <CompareBar
          text={sourceEnglishResult}
          textCompare={targetEnglishResult}
        />
      ) : // <div className="my-2.5"></div>
      null}

      {targetResult && (
        <TranslateResult result={targetResult} languageCode={targetLanguage}>
          {sourceEnglishResult &&
            targetLanguage !== DEFAULT_LANGUAGES_CODE.EN &&
            sourceLanguage !== DEFAULT_LANGUAGES_CODE.EN && (
              <TranslateMiddle
                trianglePosition="bottom"
                text={targetEnglishResult}
                textCompare={sourceEnglishResult}
              />
            )}
        </TranslateResult>
      )}

      <div className="mx-auto mt-5">
        <TranslateOptionBar sourceLang={sourceLanguage} />
      </div>
    </main>
  );
}
