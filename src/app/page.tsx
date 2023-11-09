import { CaptureProvider, CaptureZone } from '@/components/capture';
import { ImgCopy, TextCopy } from '@/components/copy-to-clipboard';
import {
  TranslateEditor,
  TranslateMiddle,
  TranslateMiddleEditor,
  TranslateResult,
} from '@/components/translate-editor';
import { detectLanguage, translateText } from '@/services/languages';

import { CompareProvider } from '@/components/compare';
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
  };
}

export default async function Home(props: HomeProps) {
  const isEdit = props.searchParams.edit === 'true';
  const sourceText = props.searchParams.query || '';
  const middleText = props.searchParams.mquery || '';

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
    <main className="flex h-full w-full flex-col">
      <CompareProvider
        text={sourceEnglishResult}
        textCompare={targetEnglishResult}
      >
        <LanguagesControlBar
          className="px-5"
          source={sourceLanguage}
          target={targetLanguage}
          detect={props.searchParams.source === 'auto' ? sourceLanguage : ''}
        />
        <CaptureProvider>
          <CaptureZone className="flex h-full w-full flex-col gap-5 p-5">
            <TranslateEditor
              disabled={isEdit}
              isDetect={props.searchParams.source === 'auto'}
              languageCode={sourceLanguage}
              sourceTranslateResult={sourceTranslateResult}
              className={
                sourceText || sourceTranslateResult ? '' : 'min-h-[320px]'
              }
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
              {isEdit && (
                <TranslateMiddleEditor defaultText={sourceEnglishResult} />
              )}
            </TranslateEditor>

            {targetResult && (
              <TranslateResult
                result={targetResult}
                languageCode={targetLanguage}
              >
                {sourceEnglishResult &&
                  targetLanguage !== DEFAULT_LANGUAGES_CODE.EN &&
                  sourceLanguage !== DEFAULT_LANGUAGES_CODE.EN && (
                    <TranslateMiddle
                      isEdit={isEdit}
                      trianglePosition="bottom"
                      type="accept"
                      text={targetEnglishResult}
                      textCompare={sourceEnglishResult}
                    />
                  )}
              </TranslateResult>
            )}
          </CaptureZone>

          <div className="absolute bottom-24 left-1/2 z-10 mt-5 flex -translate-x-1/2 items-center gap-5">
            <TextCopy
              sourceText={sourceText}
              targetText={targetResult}
              sourceEnglishText={sourceEnglishResult}
              targetEnglishText={targetEnglishResult}
              sourceLanguage={sourceLanguage as string}
              targetLanguage={targetLanguage as string}
            />

            <TranslateOptionBar sourceLang={sourceLanguage} />
            <ImgCopy />
          </div>
        </CaptureProvider>
      </CompareProvider>
    </main>
  );
}
