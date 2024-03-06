import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { ArrowLeft, Star } from 'lucide-react';
import React from 'react';
import { FAVORITE_OPTION_NAME, phraseOptions } from './options';
import { useFavoritePhrasesStore } from '@/features/translate/stores/phrases.store';
import { useTranslateStore } from '@/stores/translate.store';
import { cn } from '@/utils/cn';

export type PhraseItemViewOptionsProps = {
  phraseItemName: string;
  icon: React.ReactNode;
  onClose: () => void;
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
  icon,
  onClose,
}: PhraseItemViewOptionsProps) => {
  const isYourList = phraseItemName === FAVORITE_OPTION_NAME;
  const { favoritePhrases, updateFavoritePhrases } = useFavoritePhrasesStore();
  const yourList = getFavoritePhrases(favoritePhrases);
  const phraseItemOptions: string[] = isYourList
    ? yourList.texts
    : phraseOptions[phraseItemName] || [];

  const { setValue, setIsFocused } = useTranslateStore();
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
        const splitedTexts = option.split('#');
        const isFavorite = favoritePhrases[phraseItemName]?.includes(index);
        return (
          <div
            className={cn("flex flex-row items-center cursor-pointer hover:bg-primary-200   justify-between rounded-xl bg-primary-100 p-3", selectedIndex === index ? '!bg-primary-500-main' : '')}
            key={`${phraseItemName}-${index}`}
            onClick={() => {
              setSelectedIndex(index);
              setIsFocused(true);
              setValue(option);
            }}
          >
            <Typography className={cn("w-10/12 break-words text-left font-semibold text-neutral-700", selectedIndex === index ? ' text-white' : '',)}>
              {splitedTexts.map((text, idx) => {
                const isFillable = idx % 2 === 1;
                return <span key={idx} className={cn(isFillable && "text-base font-light leading-[18px] tracking-normal ", selectedIndex === index ? 'text-white' : '')}>
                  {isFillable ? `[${text}]` : text}
                </span>

              })}
              {/* {before}
              {fillableText.length > 0 && (
                <span className={cn("text-base font-light leading-[18px] tracking-normal ", selectedIndex === index ? '!bg-primary-500-main text-white' : '')}>
                </span>
              )}
              {after} */}
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
