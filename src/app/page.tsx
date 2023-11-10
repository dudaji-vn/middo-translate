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
import { DetectTranslateWay } from '@/components/detect-translate-way';
import { LanguagesControlBar } from '@/components/languages-control-bar';
import { PageLoading } from '@/components/page-loading';
import { TranslateOptionBar } from '@/components/translate-option-bar';
import { cn } from '@/utils/cn';

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

  const isEnglishTranslate =
    targetLanguage === DEFAULT_LANGUAGES_CODE.EN ||
    sourceLanguage === DEFAULT_LANGUAGES_CODE.EN;

  const isShowMiddleSource = sourceEnglishResult && !isEnglishTranslate;

  const isShowMiddleTarget = targetEnglishResult && !isEnglishTranslate;

  return (
    <main className="relative flex h-full w-full flex-col justify-center">
      <PageLoading title="Loading">
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
            <CaptureZone className="flex h-full w-full flex-col gap-5 px-[5vw] py-5 md:flex-row md:justify-evenly md:gap-[88px]">
              <TranslateEditor
                disabled={isEdit}
                isDetect={props.searchParams.source === 'auto'}
                languageCode={sourceLanguage}
                sourceTranslateResult={sourceTranslateResult}
                className={cn(
                  'flex flex-col md:flex-1',
                  sourceText || sourceTranslateResult ? '' : 'min-h-[320px]',
                )}
              >
                {isEdit ? (
                  <TranslateMiddleEditor defaultText={sourceEnglishResult} />
                ) : (
                  <>
                    {isShowMiddleSource && (
                      <TranslateMiddle
                        text={sourceEnglishResult}
                        textCompare={targetEnglishResult}
                      />
                    )}
                  </>
                )}
              </TranslateEditor>

              <TranslateResult
                result={targetResult}
                languageCode={targetLanguage}
              >
                {isShowMiddleTarget ? (
                  <TranslateMiddle
                    isEdit={isEdit}
                    type="accept"
                    text={targetEnglishResult}
                    textCompare={sourceEnglishResult}
                  />
                ) : null}
              </TranslateResult>
            </CaptureZone>
            <div className="mt-5 flex items-center justify-center gap-8">
              <TextCopy
                sourceText={sourceText || sourceTranslateResult}
                targetText={targetResult}
                sourceEnglishText={sourceEnglishResult}
                targetEnglishText={targetEnglishResult}
                sourceLanguage={sourceLanguage as string}
                targetLanguage={targetLanguage as string}
              />

              <TranslateOptionBar sourceLang={sourceLanguage} />
              {(sourceText || sourceTranslateResult) && <ImgCopy />}
            </div>
          </CaptureProvider>
        </CompareProvider>
      </PageLoading>
      <DetectTranslateWay
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
      />
    </main>
  );
}
