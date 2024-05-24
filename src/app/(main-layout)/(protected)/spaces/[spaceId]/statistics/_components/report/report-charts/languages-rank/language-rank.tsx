'use client';

import { Typography } from '@/components/data-display';
import { TLanguageRank } from '@/types/business-statistic.type';
import React, { useMemo, useState } from 'react';
import { SelectLimitNumber } from './select-limit-number';
import { CircleFlag } from 'react-circle-flags';
import { getCountryCode, getCountryNameByCode } from '@/utils/language-fn';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';
import LanguagePieChart from '../language-pie-chart/language-pie-chart';
import { Button } from '@/components/actions';
import { ChevronUpIcon } from 'lucide-react';
import { CHART_COLORS } from '../chart-colors';

const COLORS = [...CHART_COLORS].reverse();
const LoadingLanguageRank = () => {
  return (
    <section className="relative w-full space-y-4 py-5">
      <div className="flex flex-row items-center justify-between">
        <Typography className="text-base font-semibold text-neutral-800">
          Conversation&apos;s Language
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
  piesData = [],
  isLoading = false,
}: {
  data: TLanguageRank;
  isLoading: boolean;
  piesData: any;
}) => {
  const [showOthers, setShowOthers] = useState(false);
  const { dataSlice, others, pies } = useMemo(() => {
    const pies = piesData?.slice(0, 3).concat({
      label: 'Others',
      value: data.slice(3).reduce((acc, item) => acc + item.count, 0),
    });

    if (showOthers)
      return {
        dataSlice: data || [],
        others: [],
        pies,
      };

    if (data.length > 3) {
      const dataSlice = data.slice(0, 3) || [];
      const others = data.slice(3);
      return {
        dataSlice,
        others,
        pies,
      };
    }
    return {
      dataSlice: data,
      others: [],
      pies,
    };
  }, [data, showOthers, piesData]);

  if (isLoading) return <LoadingLanguageRank />;
  const toggleShowOthers = () => {
    setShowOthers(!showOthers);
  };
  return (
    <section className="relative w-full space-y-4 py-5">
      <div className="flex flex-row items-center justify-between">
        <Typography className="text-base font-semibold text-neutral-800">
          Conversation&apos;s Language
        </Typography>
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="flex  h-[240px] w-[100vw] justify-center md:h-[220px] md:w-[220px] md:justify-end">
          <LanguagePieChart data={pies} />
        </div>
        <div className="flex h-fit min-h-40 flex-grow flex-col items-end gap-4 transition-all duration-1000">
          {dataSlice.map((item, index) => {
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
          {others.length > 0 && (
            <div className="flex w-full flex-row items-center gap-1 md:gap-5">
              <div className="flex h-fit w-36 flex-row items-center gap-2">
                <CircleFlag countryCode={'unknown'} height={20} width={20} />
                <Typography className="line-clamp-1 max-w-32 font-normal text-neutral-800">
                  <Button
                    variant={'ghost'}
                    color={'default'}
                    shape={'square'}
                    size="xs"
                    onClick={toggleShowOthers}
                  >
                    Others
                  </Button>
                </Typography>
              </div>
              <div className="flex h-full flex-grow justify-items-start rounded-full bg-primary-100">
                <div
                  className="h-2 rounded-l-full bg-primary-500-main transition-all  duration-1000"
                  style={{
                    width: '100%',
                  }}
                />
              </div>
              <span className=" w-10 text-end text-neutral-800">
                {others.reduce((acc, item) => acc + item.total, 0)}
              </span>
            </div>
          )}
          <div className={showOthers ? 'flex w-full justify-start' : 'hidden'}>
            <Button
              variant={'ghost'}
              size="xs"
              color={'default'}
              shape={'square'}
              onClick={toggleShowOthers}
              startIcon={<ChevronUpIcon />}
            >
              hide
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LanguageRank;
