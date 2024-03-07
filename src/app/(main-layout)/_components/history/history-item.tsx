import { Button, CopyZoneClick } from '@/components/actions';
import { Text, Typography } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { Copy, Layers, Trash2 } from 'lucide-react';
import React from 'react';
import { CircleFlag } from 'react-circle-flags';
import { THistoryItem } from './history';
import {
  DEFAULT_LANGUAGES_CODE,
} from '@/configs/default-language';
import { motion, useIsPresent } from 'framer-motion';
import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';
import { cn } from '@/utils/cn';
import { useTextCopy } from '@/hooks/use-text-copy';
import { getFlagEmoji } from '@/utils/get-flag-emoji';

type TDisplayedItem = {
  languageCode: string;
  content: string;
  middleTranslation?: string;
  isShowMiddle: boolean;
} & React.HTMLAttributes<HTMLDivElement>;
const DisplayedItem = ({
  languageCode,
  content,
  middleTranslation,
  isShowMiddle = false,
  ...props
}: TDisplayedItem) => {
  const flag = getCountryCode(languageCode);
  const language = getLanguageByCode(languageCode);
  return (
    <div {...props} className={cn("flex w-full flex-col py-[6px] ", props.className)}>
      <div className="flex flex-row items-start justify-between ">
        <div className='flex-col'>
          <Typography className="flex flex-row items-center gap-2 text-[14px] text-sm font-light leading-[18px] text-neutral-400">
            <CircleFlag countryCode={flag as string} className="h-4 w-4" />
            {language?.name}
          </Typography>
          <Text
            value={content}
            className=" break-words text-sm font-normal text-neutral-800 leading-[18px] px-1"
          />
        </div>
        <CopyZoneClick text={content}>
          <Button.Icon onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
          }} variant={'ghost'} size={'xs'} color={'default'}>
            <Copy />
          </Button.Icon>
        </CopyZoneClick>
      </div>
      {isShowMiddle && middleTranslation && (
        <div className="relative">
          <TriangleSmall
            fill={'#f2f2f2'}
            position="top"
            className="absolute left-4 top-[18px]  -translate-y-full"
          />
          <div className="mb-1 mt-2 rounded-xl bg-neutral-50 p-3 text-neutral-600 flex gap-2 flex-row items-start">
            <CircleFlag countryCode={'uk'} className="h-5 w-5 mt-1" />
            <div>
              <Text
                value={middleTranslation}
                className="text-start text-sm font-light"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryItem = ({
  item,
  onDeleteItem,
  index,
  onClick
}: {
  item: THistoryItem;
  onDeleteItem: (item: THistoryItem) => void;
  onClick: () => void;
  index: number;
}): JSX.Element => {
  const { src, dest } = item;
  const { copy } = useTextCopy();
  const allowCopyAll = Boolean(
    dest.englishContent && src.content && dest.content,
  );
  const handleCopyAll = () => {
    const firstLine = `${getFlagEmoji(
      getCountryCode(src.language) as string,
    )} ${src.content}`;
    const secondLine = `${getFlagEmoji('gb')} ${dest.englishContent}`;
    const thirdLine = `${getFlagEmoji(
      getCountryCode(dest.language) as string,
    )} ${dest.content}`;
    const textFormat = `${firstLine}\n${secondLine}\n${thirdLine}`;
    copy(textFormat);
  };
  const isPresent = useIsPresent();
  if (!src || !dest) {
    return <></>;
  }

  const isEnglishTranslate =
    src.language === DEFAULT_LANGUAGES_CODE.EN ||
    dest.language === DEFAULT_LANGUAGES_CODE.EN;
  const isShowMiddle = Boolean(
    !isEnglishTranslate && src.language && dest.language,
  );

  return (
    <motion.div
      className={cn(
        'flex flex-col bg-white rounded-2xl border cursor-pointer overflow-hidden border-primary-200 [&>*]:p-3 s',
        isPresent ? 'static' : 'absolute',

      )}
      onClick={onClick}
      key={item.id}
      initial={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', duration: 0.1 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
    >
      <DisplayedItem
        languageCode={src.language}
        content={src.content}
        middleTranslation={src.englishContent}
        isShowMiddle={isShowMiddle}
        className="border-b  border-neutral-50 "
      />
      <DisplayedItem
        languageCode={dest.language}
        content={dest.content}
        middleTranslation={dest.englishContent}
        isShowMiddle={isShowMiddle}
      />

      <div className="flex items-center justify-end gap-2 bg-primary-100 py-2 rounded-b-xl">
        <Button.Icon
          variant={'default'}
          color={'secondary'}
          size={'xs'}
          disabled={isEnglishTranslate}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyAll();
          }}
          className={cn("bg-primary-200  text-primary-500-main", !allowCopyAll && 'invisible')}
        >
          <Layers />
        </Button.Icon>
        <Button.Icon
          variant={'default'}
          color={'secondary'}
          size={'xs'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteItem(item)
          }}
        >
          <Trash2 />
        </Button.Icon>
      </div>
    </motion.div>
  );
};

export default HistoryItem;
