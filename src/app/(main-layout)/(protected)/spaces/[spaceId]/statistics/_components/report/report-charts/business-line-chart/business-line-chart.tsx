'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from 'recharts';

import { ReactElement, use, useMemo } from 'react';
import { Typography } from '@/components/data-display';
import { AnalyticsOptions } from '@/features/business-spaces/hooks/use-get-space-analytic';
import { Globe, Info, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/actions';
import { CHART_TOOLTIP_CONTENT } from '@/types/business-statistic.type';

const TooltipContent = ({
  active,
  payload,
  label,
  unit,
  allowDecimals,
}: any) => {
  const value = allowDecimals
    ? Number(payload?.[0]?.value).toFixed(1)
    : payload?.[0]?.value;
  const suffix = unit;
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <p className="text-sm text-neutral-600">{`${label}`}</p>
        <p className="flex flex-row gap-1 text-base text-neutral-800">
          {`${value}`}
          <span>{suffix}</span>
        </p>
      </div>
    );
  }

  return null;
};
const chartLabel = 'label';
const chartDataKey = 'value';
export const mappedFilterByIcon: Partial<
  Record<keyof AnalyticsOptions, ReactElement>
> = {
  domain: <Globe size={16} className="text-primary-500-main" />,
  memberId: <User size={16} className="text-primary-500-main" />,
};

export default function BusinessLineChart({
  data = [],
  unit,
  title,
  filterBy = '',
  filterByKey = '',
  unitType = 'number',
  yAxisProps,
  xAxisProps,
  total,
  tooltipContent,
  ...props
}: {
  unit: string;
  data: Array<{
    label: string;
    value: number;
  }>;
  title: string;
  filterBy?: string;
  filterByKey?: string;
  unitType?: 'number' | 'category';
  yAxisProps?: YAxisProps;
  xAxisProps?: XAxisProps;
  total: string;
  tooltipContent?: string;
}) {
  const { space } = useAuthStore();
  const hasNoLine = useMemo(() => data.length === 1, [data]);
  const displayFilterBy = useMemo(() => {
    switch (filterByKey) {
      case 'domain':
        return filterBy;
      case 'memberId':
        return space?.members?.find((m) => m._id === filterBy)?.email;
    }
    return filterBy;
  }, [filterBy, filterByKey, space]);

  if (!data) return null;
  return (
    <section className="relative w-full space-y-4 bg-white px-4 py-5 md:p-10">
      <div className="flex w-full flex-row items-center justify-between">
        <Typography className="flex flex-col items-start justify-start gap-2 text-base font-semibold text-neutral-800 md:flex-row md:items-center">
          {title}
          <span
            className={cn(
              'flex flex-row items-center gap-2 font-normal text-neutral-800',
              {
                hidden: !displayFilterBy,
              },
            )}
          >
            {mappedFilterByIcon[filterByKey as keyof AnalyticsOptions]}
            {displayFilterBy}
            <span
              className={cn('font-light text-neutral-600', {
                hidden: filterByKey !== 'memberId',
              })}
            >
              (Member)
            </span>
          </span>
        </Typography>
        {total && (
          <Typography className="flex flex-row items-center justify-end gap-1 text-base font-semibold text-neutral-800">
            {total}
            <Tooltip
              title={`${tooltipContent}`}
              triggerItem={<Info size={16} className="text-neutral-800" />}
            />
          </Typography>
        )}
      </div>
      <div className="h-72 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 15,
              right: 0,
              left: 24,
              bottom: 15,
            }}
          >
            <XAxis
              dataKey={chartLabel}
              padding="no-gap"
              className="py-10"
              tickLine={false}
              axisLine={false}
              tickMargin={24}
              {...xAxisProps}
            />
            <YAxis
              tickCount={6}
              minTickGap={3}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              type={unitType}
              {...yAxisProps}
            />
            <CartesianGrid stroke="#E6E6E6" vertical={false} className="8" />
            <ChartTooltip
              content={
                <TooltipContent
                  allowDecimals={yAxisProps?.allowDecimals}
                  unit={unit}
                />
              }
            />
            <Line
              type="monotone"
              dataKey={chartDataKey}
              activeDot={{
                r: 8,
                className: 'fill-primary-500-main stroke-primary-500-main',
              }}
              dot={{
                r: hasNoLine ? 4 : 0,
                className: 'fill-primary-500-main stroke-primary-500-main',
              }}
              stroke="#3D88ED"
              strokeWidth={1}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
