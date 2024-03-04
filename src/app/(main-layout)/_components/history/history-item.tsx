import { Button } from '@/components/actions';
import { Text, Typography } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { Copy, XCircleIcon } from 'lucide-react';
import React from 'react'
import { CircleFlag } from 'react-circle-flags';
import { THistoryItem } from './history';

const HistoryItem = ({ src, dest }: THistoryItem): JSX.Element => {
    if (!src || !dest) {
      return <></>;
    }
    const translated = src.content;
    const translatedDest = dest.content;
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-primary-200 p-2">
        <div className="flex w-full flex-row justify-between">
          <div className="flex w-10/12 flex-col gap-2">
            <Typography className="flex flex-row items-center gap-2 text-[14px] font-light leading-[18px] text-neutral-400">
              <CircleFlag countryCode={'uk'} className="mr-2 inline-block h-5 " />
              {src.language}
            </Typography>
            <Typography className="text-sm">{src.content}</Typography>
          </div>
          <Button.Icon variant={'ghost'} color={'default'}>
            <Copy />
          </Button.Icon>
        </div>
        <div className="relative">
          <TriangleSmall
            fill={'#e6e6e6'}
            position="top"
            className="absolute left-4 top-[18px]  -translate-y-full"
          />
          <div className="mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600">
            <Text value={translated} className="text-start text-sm font-light" />
          </div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="flex w-10/12 flex-col gap-2">
            <Typography className="flex flex-row items-center gap-2 font-light text-neutral-400">
              <CircleFlag
                countryCode={'es'}
                className="mr-2 inline-block h-5 w-5"
              />
              {dest.language}
            </Typography>
            <Typography className="text-sm">{dest.content}</Typography>
          </div>
          <Button.Icon variant={'ghost'} color={'default'}>
            <Copy />
          </Button.Icon>
        </div>
        <div className="relative">
          <TriangleSmall
            fill={'#e6e6e6'}
            position="top"
            className="absolute left-4 top-[18px]  -translate-y-full"
          />
          <div className="mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600">
            <Text
              value={translatedDest}
              className="text-start text-sm font-light"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button.Icon
            variant={'default'}
            size={'sm'}
            // onClick={onCopyBoth}
            className="bg-primary-200 text-primary-500-main"
          >
            <Copy className="!h-6 !w-6" />
          </Button.Icon>
          <Button.Icon
            variant={'default'}
            size={'sm'}
            // onClick={onClear}
            className="bg-primary-200 text-primary-500-main"
          >
            <XCircleIcon className="!h-6 !w-6" />
          </Button.Icon>
        </div>
      </div>
    );
  };
  

export default HistoryItem