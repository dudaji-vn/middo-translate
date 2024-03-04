import { CaptureProvider, CaptureZone } from '@/components/actions';
import {
  DetectTranslateWay,
  LanguagesControlBar,
  TranslateEditor,
  TranslateMiddle,
  TranslateMiddleEditor,
  TranslateOptionBar,
  TranslateResult,
} from '@/features/translate/components';
import {
  ImgCopy,
  TextCopy,
} from '@/features/translate/components/copy-to-clipboard';
import { detectLanguage, translateText } from '@/services/languages.service';

import { CompareProvider } from '@/features/translate/context';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { PageLoading } from '@/components/feedback';
import { cn } from '@/utils/cn';
import { Extension } from '@/features/translate/components/extension';

import HomeTemplate, { TTranslationTab } from './_components/home-template';

interface HomeProps {
  searchParams: {
    query?: string;
    source?: string;
    target?: string;
    edit?: string;
    mquery?: string;
    detect?: string;
    tab?: TTranslationTab;
  };
}

export default async function Home(props: HomeProps) {
  const isEdit = props.searchParams.edit === 'true';
  const sourceText = props.searchParams.query || '';
  const middleText = props.searchParams.mquery || '';
  const currentTab = props.searchParams.tab;

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
    <main className={'h-full overflow-y-hidden'}>
      <PageLoading title="Loading" className="h-full">
        <HomeTemplate
          currentTab={currentTab}
          historyProps={{
            sourceLanguage,
            targetLanguage,
            sourceText,
            targetResult,
            sourceEnglishResult,
            targetEnglishResult,
            sourceTranslateResult,
          }}
        >
          <div className="flex h-full w-full flex-col pt-5">
            <CompareProvider
              text={sourceEnglishResult}
              textCompare={targetEnglishResult}
            >
              <LanguagesControlBar
                className="px-[5vw]"
                source={sourceLanguage}
                target={targetLanguage}
                detect={
                  props.searchParams.source === 'auto' ? sourceLanguage : ''
                }
                targetResult={targetResult}
              />
              <CaptureProvider>
                <CaptureZone className="flex h-full w-full flex-col gap-5 px-[5vw] py-3 md:flex-row md:justify-evenly md:gap-[88px]">
                  <TranslateEditor
                    disabled={isEdit}
                    isDetect={props.searchParams.source === 'auto'}
                    languageCode={sourceLanguage}
                    sourceTranslateResult={sourceTranslateResult}
                    className={cn(
                      'flex flex-col md:flex-1',
                      sourceText || sourceTranslateResult
                        ? ''
                        : 'min-h-[320px]',
                    )}
                  >
                    {isEdit ? (
                      <TranslateMiddleEditor
                        defaultText={sourceEnglishResult}
                      />
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
                    {isShowMiddleTarget && (
                      <TranslateMiddle
                        isEdit={isEdit}
                        type="accept"
                        text={targetEnglishResult}
                        textCompare={sourceEnglishResult}
                      />
                    )}
                  </TranslateResult>
                </CaptureZone>
                <Extension />
                <div className="mt-8 flex items-center justify-center gap-8">
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
          </div>
          <DetectTranslateWay
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
          />
        </HomeTemplate>
      </PageLoading>
    </main>
  );
}
