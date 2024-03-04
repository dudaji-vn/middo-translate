import { Button, CopyZoneClick } from '@/components/actions';
import { Text, Typography } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { Copy, Layers, Trash2 } from 'lucide-react';
import React from 'react';
import { CircleFlag } from 'react-circle-flags';
import { THistoryItem } from './history';
import { LANGUAGE_CODES_MAP } from '@/configs/default-language';
import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';
type TDisplayedItem = {
  languageCode: string;
  content: string;
  translation?: string;
  isSrc?: boolean;
};
const DisplayedItem = ({
  languageCode,
  content,
  translation,
  isSrc,
}: TDisplayedItem) => {
  const flag = getCountryCode(languageCode);
  const language = getLanguageByCode(languageCode);
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative  flex flex-row items-center justify-start gap-2 ">
        <Typography className="text-sm items-center flex flex-row gap-2 text-[14px] font-light leading-[18px] text-neutral-400">
          <CircleFlag countryCode={flag as string} className="h-4 w-4" />
          {language?.name}
        </Typography>
        {isSrc && (
          <CopyZoneClick text={content} className="absolute -right-4 top-0">
            <Button.Icon variant={'ghost'} color={'default'}>
              <Copy />
            </Button.Icon>
          </CopyZoneClick>
        )}
      </div>
      <Typography className="text-sm  w-11/12 break-words">{content}</Typography>
      {translation && (
        <div className="relative">
          <TriangleSmall
            fill={'#e6e6e6'}
            position="top"
            className="absolute left-4 top-[18px]  -translate-y-full"
          />
          <div className="mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600">
            <Text
              value={translation}
              className="text-start text-sm font-light"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryItem = ({ src, dest }: THistoryItem): JSX.Element => {
  if (!src || !dest) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-primary-200 p-2">
      <DisplayedItem
        languageCode={src.language}
        content={src.content}
        translation={src.content}
        isSrc
      />
      <DisplayedItem
        languageCode={dest.language}
        content={dest.content}
        translation={dest.content}
      />

      <div className="flex items-center justify-end gap-2">
        <Button.Icon
          variant={'default'}
          size={'xs'}
          className="bg-primary-200 text-primary-500-main"
        >
          <Layers className="!h-5 !w-5" />
        </Button.Icon>
        <Button.Icon
          variant={'default'}
          size={'xs'}
          className="bg-primary-200 text-primary-500-main"
        >
          <Trash2 className="!h-5 !w-5" />
        </Button.Icon>
      </div>
    </div>
  );
};

export default HistoryItem;
