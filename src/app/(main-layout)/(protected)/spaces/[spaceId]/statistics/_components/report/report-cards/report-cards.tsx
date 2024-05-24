'use client';

import React, { ReactNode, useMemo } from 'react';
import { Typography } from '@/components/data-display';
import { ArrowDown, ArrowUp, Info, Star, StarHalf } from 'lucide-react';
import { AnalysisData, ESpaceChart } from '@/types/business-statistic.type';
import { ceil } from 'lodash';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { accurateHumanize } from '@/utils/moment';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import CardsLoading from './cards-loading';
const StarRating = ({ value }: { value: number }) => {
  const fillCount = ceil(value || 0);
  const emptyCount = Math.max(5 - fillCount, 0);
  return (
    <div className="flex flex-row items-baseline justify-between space-x-2">
      {Array(ceil(fillCount))
        .fill(0)
        .map((_, index) => {
          const diff = value * 1.0 - index * 1.0;
          const isHalf = diff > 0 && diff < 1.0;
          return isHalf ? (
            <div key={index} className="relative w-fit">
              <StarHalf
                size={24}
                fill="#FFD700"
                stroke="#FFD700"
                className="absolute inset-0"
              />
              <Star size={24} fill="#f2f2f2" stroke="#f2f2f2" />
            </div>
          ) : (
            <Star key={index} size={24} fill="#FFD700" stroke="#FFD700" />
          );
        })}
      {Array(emptyCount)
        .fill(0)
        .map((_, index) => (
          <Star key={index} size={24} fill="#f2f2f2" stroke="#f2f2f2" />
        ))}
    </div>
  );
};
const Percentage = ({
  value = 0,
  suffix = '%',
  prefix,
}: {
  value: number | string;
  suffix?: String | ReactNode;
  prefix?: String | ReactNode;
}) => {
  const prefixComp = useMemo(() => {
    if (typeof value !== 'number') return null;
    return typeof prefix !== 'undefined' ? (
      prefix
    ) : value > 0 ? (
      <ArrowUp size={15} />
    ) : (
      <ArrowDown size={15} />
    );
  }, [value, prefix]);
  const displayValue = typeof value === 'number' ? value.toFixed(1) : value;
  return (
    <p
      className={cn(
        'flex flex-row items-center text-base  font-normal',
        typeof value === 'number'
          ? value >= 0
            ? 'text-success-700'
            : 'text-error-400-main'
          : 'text-neutral-600',
      )}
    >
      {prefixComp}
      {`${displayValue}`}
      <span className="ml-[2px]">{suffix}</span>
    </p>
  );
};
const tooltipContent: Record<ESpaceChart, string> = {
  newVisitor: 'The number of new visitors to your website',
  openedConversation: 'The number of opened conversations',
  dropRate: 'The rate of dropped conversations',
  responseTime: 'The average response time',
  customerRating: 'The average customer rating',
  responseMessage: 'The average response message',
  languageRank: 'The rank of languages',
};

const cardContents: Array<{
  name: ESpaceChart;
  renderDetail?: (value: number, total?: number) => JSX.Element;
  renderPercentage?: (value: any) => JSX.Element;
}> = [
  {
    name: ESpaceChart.NEW_VISITOR,
    renderDetail: (value: number) => (
      <Typography variant={'h6'} className="text-[2rem]">
        {value}
      </Typography>
    ),
    renderPercentage: (value: number) => <Percentage value={value} />,
  },
  {
    name: ESpaceChart.CUSTOMER_RATING,
    renderDetail: (value: number) => (
      <Typography variant={'h6'} className="text-[2rem]">
        {value}
      </Typography>
    ),
    renderPercentage: (value: number) => <Percentage value={value} />,
  },
  {
    name: ESpaceChart.DROP_RATE,
    renderDetail: (value: number, total?: number) => {
      const displayValue = total ? Number((value / total).toFixed(0)) * 100 : 0;
      return (
        <Typography variant={'h6'} className="text-[2rem]">
          {displayValue}&nbsp;
          {total && <span>%</span>}
        </Typography>
      );
    },
    renderPercentage: (value: number) => <Percentage value={value} />,
  },
  {
    name: ESpaceChart.RESPONSE_TIME,
    renderDetail: (value: number) => {
      const displayTime =
        accurateHumanize(moment.duration(value, 'milliseconds'), 1)
          .accuratedTime || '0';
      return (
        <Typography variant={'h6'} className="text-[2rem]">
          {displayTime}
        </Typography>
      );
    },
    renderPercentage: (value: number) => <Percentage value={value} />,
  },
  {
    name: ESpaceChart.CUSTOMER_RATING,
    renderDetail: (value: number) => <StarRating value={value} />,
  },

  {
    name: ESpaceChart.RESPONSE_MESSAGE,
    renderDetail: (value: number) => (
      <Typography variant={'h6'} className="text-[2rem]">
        {value}
      </Typography>
    ),
    renderPercentage: (value: number) => <Percentage value={value} />,
  },
];
const ReportCards = ({
  data,
  loading,
}: {
  data?: AnalysisData;
  loading: boolean;
}) => {
  const { t } = useTranslation('common');
  if (loading) return <CardsLoading title={t('BUSINESS.REPORT')} />;
  if (!data) return null;
  return (
    <section className="relative w-full space-y-4">
      <Typography className=" flex flex-row items-center justify-between space-y-0 text-base font-semibold text-neutral-800">
        {t('BUSINESS.REPORT')}
      </Typography>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3 ">
        {cardContents.map(({ name, renderDetail, renderPercentage }, index) => {
          let percentage = data[name]?.growth * 100 || 0;

          const displayTitle = t(`BUSINESS.CHART.${name.toUpperCase()}`);
          return (
            <Card
              key={index}
              className={cn(
                'cursor-pointer gap-2 rounded-[12px] border border-solid p-5 transition-all duration-300 ease-in-out hover:border-primary-300',
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between p-0 text-neutral-600">
                <CardTitle className="text-base font-normal leading-[18px]">
                  {displayTitle}
                </CardTitle>
                <Tooltip
                  title={tooltipContent[name]}
                  contentProps={{
                    className: 'text-neutral-800',
                  }}
                  triggerItem={
                    <div className="h-fit w-fit rounded-full p-2 text-neutral-300 hover:bg-neutral-50">
                      <Info size={20} className="" />
                    </div>
                  }
                />
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex min-h-[48px]  flex-row items-end justify-between space-x-4">
                  {renderDetail &&
                    renderDetail(data[name]?.value || 0, data[name]?.total)}
                  {renderPercentage && renderPercentage(percentage)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ReportCards;