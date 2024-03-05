import { Button, CopyZoneClick } from '@/components/actions';
import { Text, Typography } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { Copy, Layers, Trash2 } from 'lucide-react';
import React from 'react';
import { CircleFlag } from 'react-circle-flags';
import { THistoryItem } from './history';
import {
  DEFAULT_LANGUAGES_CODE,
  LANGUAGE_CODES_MAP,
} from '@/configs/default-language';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';
import { cn } from '@/utils/cn';

type TDisplayedItem = {
  languageCode: string;
  content: string;
  middleTranslation?: string;
  isShowMiddle: boolean;
};
const DisplayedItem = ({
  languageCode,
  content,
  middleTranslation,
  isShowMiddle = false,
}: TDisplayedItem) => {
  const flag = getCountryCode(languageCode);
  const language = getLanguageByCode(languageCode);
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-row items-center justify-between ">
        <Typography className="flex flex-row items-center gap-2 text-[14px] text-sm font-light leading-[18px] text-neutral-400">
          <CircleFlag countryCode={flag as string} className="h-4 w-4" />
          {language?.name}
        </Typography>
        <CopyZoneClick text={content}>
          <Button.Icon variant={'ghost'} size={'xs'} color={'default'}>
            <Copy />
          </Button.Icon>
        </CopyZoneClick>
      </div>
      <Typography className="w-[90%]  break-words text-sm ">
        {content}
      </Typography>
      {isShowMiddle && middleTranslation && (
        <div className="relative">
          <TriangleSmall
            fill={'#e6e6e6'}
            position="top"
            className="absolute left-4 top-[18px]  -translate-y-full"
          />
          <div className="mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600">
            <Text
              value={middleTranslation}
              className="text-start text-sm font-light"
            />
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
}: {
  item: THistoryItem;
  onDeleteItem: (item: THistoryItem) => void;
  index: number;
}): JSX.Element => {
  const { src, dest } = item;
  const onCopyAll = () => {
    const text = `${src.content}\n${dest.content}`;
    navigator.clipboard.writeText(text);
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
        'flex flex-col gap-2 rounded-2xl border border-primary-200 p-2',
        isPresent ? 'static' : 'absolute',
      )}
      key={item.id}
      initial={{ opacity: 0, x: 100 }}
      transition={{ type: 'spring', duration: 0.5 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <DisplayedItem
        languageCode={src.language}
        content={src.content}
        middleTranslation={src.englishContent}
        isShowMiddle={isShowMiddle}
      />
      <DisplayedItem
        languageCode={dest.language}
        content={dest.content}
        middleTranslation={dest.englishContent}
        isShowMiddle={isShowMiddle}
      />

      <div className="flex items-center justify-end gap-2">
        <Button.Icon
          variant={'default'}
          size={'xs'}
          onClick={onCopyAll}
          className="bg-primary-200 text-primary-500-main"
        >
          <Layers className="!h-5 !w-5" />
        </Button.Icon>
        <Button.Icon
          variant={'default'}
          size={'xs'}
          onClick={() => onDeleteItem(item)}
          className="bg-primary-200 text-primary-500-main"
        >
          <Trash2 className="!h-5 !w-5" />
        </Button.Icon>
      </div>
    </motion.div>
  );
};

export default HistoryItem;
