'use client';

import { Typography } from '@/components/data-display';
import { TLanguageRank } from '@/types/business-statistic.type';
import React, { useMemo, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { getCountryCode, getCountryNameByCode } from '@/utils/language-fn';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';
import LanguagePieChart from '../language-pie-chart/language-pie-chart';
import { Button } from '@/components/actions';
import { ChevronDown, ChevronUpIcon } from 'lucide-react';
import { CHART_COLORS } from '../chart-colors';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useTranslation } from 'react-i18next';

const COLORS = [...CHART_COLORS].reverse();
const LoadingLanguageRank = () => {
  return (
    <section className="relative w-full space-y-4  bg-white px-4 py-5 dark:bg-background md:px-10">
      <div className="flex flex-row items-center justify-between">
        <Typography className="text-base font-semibold text-neutral-800 dark:text-neutral-50">
          Conversation&apos;s Language
        </Typography>
      </div>
      <div className="flex w-full flex-col gap-4 max-md:items-center md:flex-row">
        <div>
          <Skeleton className="relative h-60 w-60 rounded-full bg-primary-200">
            <div className="absolute inset-6 rounded-full bg-white dark:bg-neutral-800" />
          </Skeleton>
        </div>
        <div className="flex h-fit min-h-40 flex-grow flex-col  items-end gap-4 transition-all duration-1000 w-full">
          {Array.from({ length: 3 }).map((_, index) => {
            return (
              <div
                className="flex w-full flex-row items-center gap-1 md:gap-5"
                key={index}
              >
                <div className="flex h-fit w-36 flex-row items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                  <Skeleton className="h-5 w-32 rounded-md bg-neutral-100 dark:bg-neutral-800" />
                </div>
                <Skeleton className=" h-2 w-full flex-grow rounded-full bg-primary-200 dark:bg-neutral-800" />
                <Skeleton className="h-5 w-5 rounded-md " />
              </div>
            );
          })}
        </div>
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
  const { t } = useTranslation('common');
  const [showOthers, setShowOthers] = useState(false);
  const { dataSlice, others, otherPercentage, total } = useMemo(() => {
    const others = data.slice(3) || [];
    const entireTotal = data.reduce((acc, item) => acc + item.count, 0);
    const otherCount = others.reduce((acc, item) => acc + item.count, 0);
    const otherPercentage = entireTotal ? (otherCount * 100) / entireTotal : 0;
    if (showOthers || data.length <= 3)
      return {
        dataSlice: data || [],
        others: [],
        otherPercentage,
        total: entireTotal || 0,
      };

    const dataSlice = data.slice(0, 3) || [];
    return {
      dataSlice,
      others,
      otherPercentage,
      total: entireTotal || 0,
    };
  }, [data, showOthers]);

  if (isLoading) return <LoadingLanguageRank />;
  const toggleShowOthers = () => {
    setShowOthers(!showOthers);
  };
  const isEmpty = dataSlice.length === 0;
  if (isEmpty) return null;
  return (
    <section className="relative w-full space-y-4  bg-white px-3 py-4 dark:bg-background md:px-10">
      <div className="flex flex-row items-center justify-between">
        <Typography className="text-base font-semibold text-neutral-800 dark:text-neutral-50">
          {t('EXTENSION.CHART.LANGUAGERANK')}
        </Typography>
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <LanguagePieChart
          languagesRank={dataSlice}
          othersCount={others.reduce((acc, item) => acc + item.count, 0)}
          data={piesData}
          className="flex h-[250px] w-full justify-start md:w-[250px] md:flex-col md:items-start"
        />
        <div className="flex h-fit min-h-40 flex-grow flex-col items-end gap-4 transition-all duration-1000">
          {dataSlice.map((item, index) => {
            const percentage = total ? (item.count * 100) / total : 0 || 0;
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
                  <Tooltip
                    title={getCountryNameByCode(item.language)}
                    triggerItem={
                      <Typography className="line-clamp-1 max-w-32 font-normal text-neutral-800 dark:text-neutral-50">
                        {getCountryNameByCode(item.language)}
                      </Typography>
                    }
                  />
                </div>
                <div className="flex h-full flex-grow justify-items-start rounded-full bg-primary-100 dark:bg-neutral-900">
                  <div
                    className={cn(
                      'relative h-2 rounded-l-full transition-all duration-1000',
                      { 'rounded-r-full': percentage === 100 },
                    )}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: index < 3 ? COLORS[index] : COLORS[3],
                    }}
                  />
                </div>
                <span className=" w-10 text-end text-neutral-800 dark:text-neutral-50">
                  {item?.count}
                </span>
              </div>
            );
          })}
          {others.length > 0 && (
            <div className="flex w-full flex-row items-center gap-1 md:gap-5">
              <div className="flex h-fit w-36 flex-row items-center gap-2">
                <Button
                  variant={'ghost'}
                  color={'default'}
                  shape={'square'}
                  size="xs"
                  startIcon={<ChevronDown />}
                  onClick={toggleShowOthers}
                >
                  {t('COMMON.OTHERS')}...
                </Button>
              </div>
              <div className="flex h-full flex-grow justify-items-start rounded-full bg-primary-100 dark:bg-neutral-900">
                <div
                  className={cn(
                    'h-2 rounded-l-full transition-all  duration-1000',
                    {
                      'rounded-r-full': otherPercentage === 100,
                    },
                  )}
                  style={{
                    width: `${otherPercentage}%`,
                    backgroundColor: COLORS[3],
                  }}
                />
              </div>
              <span className=" w-10 text-end text-neutral-800 dark:text-neutral-50">
                {others.reduce((acc, item) => acc + item.count, 0)}
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
              {t('COMMON.SHOW_LESS')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LanguageRank;
