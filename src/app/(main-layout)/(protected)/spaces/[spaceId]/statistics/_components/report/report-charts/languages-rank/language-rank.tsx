'use client';

import { Typography } from '@/components/data-display';
import { TLanguageRank } from '@/types/business-statistic.type';
import React, { useState } from 'react';
import { SelectLimitNumber } from './select-limit-number';
import { CircleFlag } from 'react-circle-flags';
import { getCountryCode, getCountryNameByCode } from '@/utils/language-fn';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';
const LoadingLanguageRank = () => {
  return (
    <section className="relative w-full space-y-4 py-5">
      <div className="flex flex-row items-center justify-between">
        <Typography className="text-base font-semibold text-neutral-800">
          Conversation's Language
        </Typography>
        <SelectLimitNumber value={3} onChange={() => {}} />
      </div>
      <div className="flex h-fit min-h-40 flex-col gap-4 transition-all  duration-1000">
        {Array.from({ length: 3 }).map((_, index) => {
          return (
            <div
              className="flex w-full flex-row items-center gap-1 md:gap-5"
              key={index}
            >
              <div className="flex h-fit w-36 flex-row items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full bg-neutral-100" />
                <Skeleton className="h-5 w-32 rounded-md bg-neutral-100" />
              </div>
              <Skeleton className=" h-2 w-full flex-grow rounded-full bg-primary-200 " />
              <Skeleton className="h-5 w-5 rounded-md " />
            </div>
          );
        })}
      </div>
    </section>
  );
};

const LanguageRank = ({
  data = [],
  isLoading = false,
}: {
  data: TLanguageRank;
  isLoading: boolean;
}) => {
  const [top, setTop] = useState<number>(3);
  const displayData = data.slice(0, top);
  if (isLoading) return <LoadingLanguageRank />;
  return (
    <section className="relative w-full space-y-4 py-5">
      <div className="flex flex-row items-center justify-between">
        <Typography className="text-base font-semibold text-neutral-800">
          Conversation's Language
        </Typography>
        <SelectLimitNumber value={top} onChange={setTop} />
      </div>

      <div className="flex h-fit min-h-40 flex-col gap-4 transition-all  duration-1000">
        {displayData.map((item, index) => {
          const percentage = item?.total
            ? (item.count * 100) / item?.total
            : 0 || 0;
          if (!item) return null;
          return (
            <div
              className="flex w-full flex-row items-center gap-1 md:gap-5"
              key={item.language}
            >
              <div className="flex h-fit w-36 flex-row items-center gap-2">
                <CircleFlag
                  countryCode={getCountryCode(item.language) || 'us'}
                  height={20}
                  width={20}
                />
                <Typography className="line-clamp-1 max-w-32 font-normal text-neutral-800">
                  {getCountryNameByCode(item.language)}
                </Typography>
              </div>
              <div className="flex h-full flex-grow justify-items-start rounded-full bg-primary-100">
                <div
                  className={cn(
                    'h-2 rounded-l-full bg-primary-500-main transition-all  duration-1000',
                    { 'rounded-r-full': percentage === 100 },
                  )}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
              <span className=" w-10 text-end text-neutral-800">
                {item.total}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LanguageRank;
