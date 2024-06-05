import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { SvgSpinnersGooeyBalls1 } from '@/components/icons';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useFavoritePhrasesStore } from '@/features/translate/stores/phrases.store';
import { translateText } from '@/services/languages.service';
import { useAppStore } from '@/stores/app.store';
import { useTranslateStore } from '@/stores/translate.store';
import { cn } from '@/utils/cn';
import { ArrowLeft, Star, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { SearchParams } from '../../translation/page';
import { FAVORITE_OPTION_NAME, phraseOptions } from './options';

export type PhraseItemViewOptionsProps = {
  phraseItemName: string;
  icon: React.ReactNode;
  onClose: () => void;
  onCloseAll?: () => void;
  searchParams: SearchParams;
};
const getFavoritePhrases = (favoritePhrases: Record<string, number[]>) => {
  let position: Array<{ optionName: string; index: number }> = [];
  const texts = Object.entries(phraseOptions).reduce<string[]>(
    (acc, [optionName, texts]) => {
      const options = texts || [];
      if (favoritePhrases[optionName]) {
        const checkedTexts =
          favoritePhrases[optionName].map((index: number) => {
            position.push({ optionName, index });
            return options[index];
          }) || [];
        return [...acc, ...checkedTexts];
      }
      return acc;
    },
    [],
  );
  return { texts, position };
};

const PhraseItemViewOptions = ({
  phraseItemName,
  searchParams,
  icon,
  onClose,
}: PhraseItemViewOptionsProps) => {
  const isYourList = phraseItemName === FAVORITE_OPTION_NAME;
  const { favoritePhrases, updateFavoritePhrases } = useFavoritePhrasesStore();
  const yourList = getFavoritePhrases(favoritePhrases);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);
  const phraseItemOptions: string[] = isYourList
    ? yourList.texts
    : phraseOptions[phraseItemName] || [];
  const { setValue: setTranslateEditorInputValue, value: currentInputValue } =
    useTranslateStore();
  const isMobile = useAppStore((state) => state.isMobile);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFavorite = (phraseName: string, optionIndex: number) => {
    const optionCheckList = favoritePhrases[phraseName] || [];
    const isUnChecked = optionCheckList.includes(optionIndex);
    const newOptionCheckList = isUnChecked
      ? optionCheckList.filter((i) => i !== optionIndex)
      : [...optionCheckList, optionIndex];
    updateFavoritePhrases(phraseName, newOptionCheckList);
  };
  const handleRemoveFavorite = (optionIndex: number) => {
    const { optionName, index } = yourList.position[optionIndex];
    const optionCheckList = favoritePhrases[optionName] || [];
    const newOptionCheckList = optionCheckList.filter((i) => i !== index);
    updateFavoritePhrases(optionName, newOptionCheckList);
  };
  const currentInputLanguage = searchParams?.['source'] || 'auto';
  const currentOutputLanguage = searchParams?.['target'];
  const handlePhraseOptionClick = async (index: number, option: string) => {
    setIsLoading(true);
    const translated =
      currentInputLanguage === DEFAULT_LANGUAGES_CODE.EN ||
      currentInputLanguage == 'auto'
        ? option
        : await translateText(
            option,
            DEFAULT_LANGUAGES_CODE.EN,
            currentInputLanguage,
          );
    setSelectedIndex(index);
    setTranslateEditorInputValue(translated);
    if (translated === searchParams?.query) {
      setIsLoading(false);
      return;
    }
    router.replace(
      `/?query=${translated}&source=${currentInputLanguage}&target=${currentOutputLanguage}${
        isMobile || !searchParams?.tab ? '' : `&tab=${searchParams?.tab}`
      }`,
    );
  };
  useEffect(() => {
    setSelectedIndex(-1);
  }, [currentInputLanguage]);

  useEffect(() => {
    setIsLoading(false);
  }, [searchParams]);

  return (
    <div className="flex h-fit w-full flex-col gap-3 px-3 pb-5 max-md:pl-0">
      {isLoading && (
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 top-0 z-[999] flex items-center justify-center bg-black/20',
          )}
        >
          <SvgSpinnersGooeyBalls1 className="h-[32px] w-[32px] text-primary" />
        </div>
      )}
      <div className="-mr-4 flex w-full flex-row-reverse items-center justify-between gap-3 max-md:pl-5 md:flex-row  md:justify-start md:gap-1">
        <Button.Icon
          variant={'ghost'}
          size={'xs'}
          color={'default'}
          className="m-0"
          onClick={onClose}
        >
          <ArrowLeft className="max-md:hidden" />
          <XIcon className="md:hidden" />
        </Button.Icon>
        <Typography className="flex flex-row items-center  gap-2 break-words font-semibold text-neutral-700 dark:text-neutral-50">
          {icon}
          {phraseItemName}
        </Typography>
      </div>
      <div className="flex w-full flex-col gap-3 overflow-y-auto">
        {phraseItemOptions.map((option, index) => {
          const simplifiedText = option
            .replaceAll('[', '#')
            .replaceAll(']', '#');
          const splitedTexts = simplifiedText.split('#');
          const isFavorite = favoritePhrases[phraseItemName]?.includes(index);
          return (
            <div
              className={cn(
                ' flex cursor-pointer flex-row items-center justify-between rounded-xl   bg-primary-100 p-3 hover:bg-primary-200 max-md:ml-3 dark:bg-neutral-900 dark:hover:bg-neutral-800',
                selectedIndex === index ? '!bg-primary-300 dark:!bg-neutral-800' : '',
              )}
              key={`${phraseItemName}-${index}`}
              onClick={(e) => handlePhraseOptionClick(index, option)}
            >
              <Typography
                className={cn(
                  'w-10/12 break-words text-left font-semibold text-neutral-700 dark:text-neutral-50',
                  selectedIndex === index ? '' : '',
                )}
              >
                {splitedTexts.map((text, idx) => {
                  const isFillable = idx % 2 === 1;
                  return (
                    <span
                      key={idx}
                      className={cn(
                        isFillable &&
                          'text-base font-light leading-[18px] tracking-normal ',
                        selectedIndex === index ? '' : '',
                      )}
                    >
                      {isFillable ? `[${text}]` : text}
                    </span>
                  );
                })}
              </Typography>
              <Button.Icon
                variant={'ghost'}
                size={'xs'}
                color={'default'}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (isYourList) {
                    handleRemoveFavorite(index);
                    return;
                  }
                  handleFavorite(phraseItemName, index);
                }}
              >
                {isFavorite || isYourList ? (
                  <Star fill={'#3D88ED'} stroke={'#3D88ED'} />
                ) : (
                  <Star />
                )}
              </Button.Icon>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhraseItemViewOptions;
