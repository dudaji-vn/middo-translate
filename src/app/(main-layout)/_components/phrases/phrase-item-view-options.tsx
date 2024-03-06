import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { ArrowLeft, Star } from 'lucide-react';
import React, { useEffect } from 'react';
import { FAVORITE_OPTION_NAME, phraseOptions } from './options';
import { useFavoritePhrasesStore } from '@/features/translate/stores/phrases.store';
import { useTranslateStore } from '@/stores/translate.store';
import { cn } from '@/utils/cn';
import { translateText } from '@/services/languages.service';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';

export type PhraseItemViewOptionsProps = {
  phraseItemName: string;
  icon: React.ReactNode;
  onClose: () => void;
  currentInputLanguage: string;
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
  currentInputLanguage,
  icon,
  onClose,
}: PhraseItemViewOptionsProps) => {
  const isYourList = phraseItemName === FAVORITE_OPTION_NAME;
  const { favoritePhrases, updateFavoritePhrases } = useFavoritePhrasesStore();
  const yourList = getFavoritePhrases(favoritePhrases);
  const phraseItemOptions: string[] = isYourList
    ? yourList.texts
    : phraseOptions[phraseItemName] || [];

  const {
    setValue: setTranslateEditorInputValue,
    setIsFocused,
    isEnglishTranslate,
  } = useTranslateStore();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

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
  const handlePhraseOptionClick = async (index: number, option: string) => {
    console.log('currentInputLanguage', currentInputLanguage)
    const translated = isEnglishTranslate || currentInputLanguage == 'auto' ? option : await translateText(
      option,
      DEFAULT_LANGUAGES_CODE.EN,
      currentInputLanguage
    );
    setSelectedIndex(index);
    setIsFocused(true);
    setTranslateEditorInputValue(translated);
  }
  useEffect(() => {
    if (selectedIndex === -1 || !phraseItemOptions[selectedIndex]) return;
    handlePhraseOptionClick(selectedIndex, phraseItemOptions[selectedIndex])
  }, [currentInputLanguage]);
  return (
    <div className="flex h-full w-full flex-col gap-3 px-3">
      <div className=" flex w-full flex-row items-center justify-start gap-2 ">
        <Button.Icon
          variant={'ghost'}
          size={'xs'}
          color={'default'}
          className="[&_svg]:text-neutral-800"
          onClick={onClose}
        >
          <ArrowLeft />
        </Button.Icon>
        {icon}
        <Typography className="break-words font-semibold text-neutral-700">
          {phraseItemName}
        </Typography>
      </div>
      {phraseItemOptions.map((option, index) => {
        const simplifiedText = option.replaceAll('[', '#').replaceAll(']', '#')
        const splitedTexts = simplifiedText.split('#');
        const isFavorite = favoritePhrases[phraseItemName]?.includes(index);
        return (
          <div
            className={cn("flex flex-row items-center cursor-pointer hover:bg-primary-200   justify-between rounded-xl bg-primary-100 p-3", selectedIndex === index ? '!bg-primary-300' : '')}
            key={`${phraseItemName}-${index}`}
            onClick={(e) => handlePhraseOptionClick(index, option)}
          >
            <Typography className={cn("w-10/12 break-words text-left font-semibold text-neutral-700", selectedIndex === index ? ' text-white' : '',)}>
              {splitedTexts.map((text, idx) => {
                const isFillable = idx % 2 === 1;
                return <span key={idx} className={cn(isFillable && "text-base font-light leading-[18px] tracking-normal ", selectedIndex === index ? 'text-white' : '')}>
                  {isFillable ? `[${text}]` : text}
                </span>

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
  );
};

export default PhraseItemViewOptions;
