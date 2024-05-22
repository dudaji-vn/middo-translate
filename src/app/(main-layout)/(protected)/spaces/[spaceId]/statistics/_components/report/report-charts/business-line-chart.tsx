'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';
import { Typography } from '@/components/data-display';

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  const { value } = payload?.[0] || {};
  const suffix = unit ? `(${unit}${value <= 1 ? '' : 's'})` : '';
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
export function BusinessLineChart({
  data = [],
  nameField,
  unit,
  title,
}: {
  nameField: string;
  unit: string;
  data: Array<{
    label: string;
    value: number;
  }>;
  title: string;
}) {
  if (!data) return null;
  const hasNoLine = useMemo(() => data.length === 1, [data]);
  return (
    <section className="relative w-full space-y-4">
      <Typography className="flex flex-row items-center justify-between space-y-0 text-base font-semibold text-neutral-800">
        {title}
      </Typography>
      <Card className="border-none p-0">
        <CardContent className="p-0">
          <div className="h-80 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 15,
                  right: 0,
                  left: 0,
                  bottom: 15,
                }}
              >
                <XAxis dataKey={chartLabel} padding={'gap'} className="py-4" />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid
                  stroke="#E6E6E6"
                  vertical={false}
                  className="8"
                />
                <Tooltip content={<CustomTooltip unit={unit} />} />
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey={chartDataKey}
                  activeDot={{
                    r: 8,
                    className:
                      'fill-primary-500-main stroke-primary-500-main w-[1rem] h-[1rem]',
                  }}
                  dot={{
                    r: hasNoLine ? 4 : 0,
                    className: 'fill-primary-500-main stroke-primary-500-main',
                  }}
                  className=" stroke-primary-500-main"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
