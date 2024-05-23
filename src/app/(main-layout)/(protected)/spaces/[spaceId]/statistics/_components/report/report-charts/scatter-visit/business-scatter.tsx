import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Rectangle,
  Legend,
  RectangleProps,
} from 'recharts';

const formatWeekday = (weekday: number) => {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][weekday] || '';
};

const getHeatGroups = (dataset: any) => {
  const breakpoints = [
    { temp: -10, color: '#FFFFFF' },
    { temp: 0, color: '#FCFCFC' },
    {
      temp: 1,
      color: '#D0DEF1',
    },
    {
      temp: 2,
      color: '#A4C2EA',
    },
    { temp: 3, color: '#72A5E9' },
    { temp: 5, color: '#3D88ED' },
    { temp: 8, color: '#FCFCFC' },
    { temp: 13, color: '#096AEC' },
    { temp: 21, color: '#003D8F' },
    {
      temp: 34,
      color: '#00275C',
    },
  ];
  let remaining = [...dataset];
  const heatGroups = [];

  breakpoints.forEach(({ temp, color }, index) => {
    heatGroups.push({
      label: `>= ${temp}`,
      color,
      data: remaining.filter((d) => d.density >= temp),
    });

    remaining = remaining.filter((d) => d.density > temp);
  });
  if (remaining.length > 0) {
    heatGroups.push({
      label: `< ${breakpoints.pop()?.temp}`,
      color: '#003D8F',
      data: remaining,
    });
  }

  return heatGroups;
};

const CustomShape = (props: RectangleProps) => {
  const x = (props.x || 0) - 18;
  const y = (props.y || 0) - 18;
  return (
    <Rectangle
      {...props}
      height={46}
      x={x}
      width={44}
      y={y}
      stroke="white"
      radius={4}
    />
  );
};

const HeatMap = ({
  data: { baseDensity, weeklyVariance = [] },
}: {
  data: {
    baseDensity: number;
    weeklyVariance: {
      x: number;
      y: number;
      density: number;
    }[];
  };
}) => {
  const dataset = weeklyVariance.map((i) => ({
    ...i,
    density: baseDensity + i.density,
  }));

  return (
    <ScatterChart
      height={420}
      width={1200}
      margin={{
        top: 15,
        right: 0,
        left: 24,
        bottom: 15,
      }}
    >
      <XAxis
        dataKey="x"
        domain={[0, 23]}
        minTickGap={10}
        type="number"
        tickCount={25}
        tickLine={false}
        padding={{ left: 40, right: 30 }}
      />
      <YAxis
        dataKey="y"
        reversed
        tickCount={8}
        interval={0}
        minTickGap={10}
        padding={{ top: 25 }}
        tickLine={false}
        tickFormatter={formatWeekday}
        tick={{ fontSize: 16 }}
        domain={[0, 7]}
      />

      {getHeatGroups(dataset).map((group) => (
        <Scatter
          name={group.label}
          data={group.data}
          fill={group.color}
          shape={CustomShape}
        />
      ))}
      <Tooltip
        content={({ payload }) => {
          const data = payload && payload[0] && payload[0].payload;
          const { y, x, density } = data || {};
          const fromTime = x - 1 < 0 ? 23 : x - 1;
          const toTime = x;
          return (
            <div
              id="tooltip"
              className="border-primary-200/80 rounded-2xl bg-neutral-800/50 p-3 text-white"
            >
              <p>Weekday: {`${formatWeekday(y)}`}</p>
              <p>Time range: {`${fromTime}h30 - ${toTime}h30`}</p>
              <p>
                Density: {density && density.toFixed(0)}&nbsp;opened&nbsp;
                conversation
              </p>
            </div>
          );
        }}
      />
      <Legend />
    </ScatterChart>
  );
};

const weeklyVarianceCal = (
  densityData: {
    x: number;
    y: number;
    density: number;
  }[],
) => {
  const densities = densityData.reduce(
    (acc, d) => {
      const key = `${d.x}-${d.y}`;
      acc[key] = d.density;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Array.from({ length: 7 * 24 }, (_, i) => {
    const x = i % 24;
    const y = Math.floor(i / 24);
    const density = densities[`${x}-${y}`] || 0;
    return {
      x: x,
      y: y,
      density: density,
    };
  });
};

export default function BusinessScatter({
  data,
  displayFilterBy,
}: {
  data: {
    x: number;
    y: number;
    density: number;
  }[];
  displayFilterBy?: string;
}) {
  const dataset = useMemo(() => {
    return {
      baseDensity: 0,
      weeklyVariance: data ? weeklyVarianceCal(data) : [],
    };
  }, [data]);

  return (
    <section className="relative w-full space-y-4  py-5">
      <Typography className="flex flex-row items-center justify-start gap-2 text-base font-semibold text-neutral-800">
        Traffic track
        <span
          className={cn(
            'flex flex-row items-center gap-2 font-normal text-neutral-800',
            {
              hidden: !displayFilterBy,
            },
          )}
        >
          {displayFilterBy}
        </span>
      </Typography>
      <div className="h-[440px] min-h-[440px] overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <HeatMap data={dataset} />
        </ResponsiveContainer>
      </div>
    </section>
  );
}
