'use client';

import {
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from 'recharts';

import { ReactElement, useMemo } from 'react';
import { Typography } from '@/components/data-display';
import { AnalyticsOptions } from '@/features/business-spaces/hooks/use-get-space-analytic';
import { Globe, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';

const TooltipContent = ({ active, payload, label, unit }: any) => {
  const { value } = payload?.[0] || {};
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
const mappedFilterByIcon: Partial<
  Record<keyof AnalyticsOptions, ReactElement>
> = {
  domain: <Globe size={16} className="text-primary-500-main" />,
  memberId: <User size={16} className="text-primary-500-main" />,
};

export default function LanguagePieChart({
  data = [],
  title,
  filterBy = '',
  filterByKey = '',
}: {
  data: Array<{
    label: string;
    value: number;
  }>;
  title: string;
  filterBy?: string;
  filterByKey?: string;
}) {
  const { space } = useAuthStore();
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
    <section className="relative w-full space-y-4  py-5">
      <Typography className="flex flex-row items-center justify-start gap-2 text-base font-semibold text-neutral-800">
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
        </span>
      </Typography>
      <div className="h-72 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
