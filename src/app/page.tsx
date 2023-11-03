import {
  TranslateEditor,
  TranslateMiddle,
  TranslateResult,
} from '@/components/translate-editor';

import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { LanguagesControlBar } from '@/components/languages-control-bar';
import { translateText } from '@/services/languages';

interface HomeProps {
  searchParams: {
    query?: string;
    source?: string;
    target?: string;
    edit?: string;
    mquery?: string;
  };
}

export default async function Home(props: HomeProps) {
  const isEdit = props.searchParams.edit === 'true';
  const sourceText = props.searchParams.query || '';
  const middleText = props.searchParams.mquery || '';

  const sourceLanguage = props.searchParams.source;
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
    ? await translateText(middleText, DEFAULT_LANGUAGES_CODE.EN, sourceLanguage)
    : '';

  return (
    <main className="flex h-full w-full flex-col gap-5 px-5">
      <LanguagesControlBar source={sourceLanguage} target={targetLanguage} />
      <TranslateEditor
        disabled={isEdit}
        languageCode={sourceLanguage}
        sourceTranslateResult={sourceTranslateResult}
        className={sourceText ? '' : 'min-h-[40vh]'}
      />
      {sourceEnglishResult &&
        targetLanguage !== DEFAULT_LANGUAGES_CODE.EN &&
        sourceLanguage !== DEFAULT_LANGUAGES_CODE.EN && (
          <TranslateMiddle
            result={sourceEnglishResult}
            targetResult={targetEnglishResult}
          />
        )}
      {targetResult && (
        <TranslateResult
          result={targetResult}
          resultEnglish={middleText ? '' : targetEnglishResult}
          status="error"
          languageCode={targetLanguage}
        />
      )}
    </main>
  );
}
