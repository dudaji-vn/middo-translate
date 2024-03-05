import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { ArrowLeft, Star } from 'lucide-react';
import React from 'react';
import { phraseOptions } from './options';
import { useFavoritePhrasesStore } from '@/features/translate/stores/phrases.store';

export type PhraseItemViewOptionsProps = {
  phraseItemName: string;
  icon: React.ReactNode;
  onClose: () => void;
};

const FAVORITE_OPTION_NAME = 'Your list';

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

  const handleFavorite = (phraseName: string, optionIndex: number) => {
    const optionCheckList = favoritePhrases[phraseName] || [];
    const isUnChecked = optionCheckList.includes(optionIndex);
    const newOptionCheckList = isUnChecked
      ? optionCheckList.filter((index) => index !== optionIndex)
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
        const fillableText = option.substring(
          option.indexOf('[') + 1,
          option.lastIndexOf(']'),
        );
        const before = option.substring(0, option.indexOf('['));
        const after = option.substring(option.lastIndexOf(']') + 1);
        const isFavorite = favoritePhrases[phraseItemName]?.includes(index);
        return (
          <div
            className="flex flex-row items-center justify-between rounded-xl bg-primary-100 p-3"
            key={`${phraseItemName}-${index}`}
          >
            <Typography className="w-10/12 break-words font-semibold text-neutral-700">
              {before}
              {fillableText.length > 0 && (
                <span className="text-left text-base font-light leading-[18px] tracking-normal text-neutral-500">
                  &#91;{fillableText}&#93;
                </span>
              )}
              {after}
            </Typography>
            <Button.Icon
              variant={'ghost'}
              size={'xs'}
              color={'default'}
              onClick={() => {
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
