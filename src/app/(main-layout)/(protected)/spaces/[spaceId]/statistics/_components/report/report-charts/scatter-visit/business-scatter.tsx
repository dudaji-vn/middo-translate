import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import React, { useMemo } from 'react';
import { ResponsiveContainer, Tooltip } from 'recharts';
import HeatMap from '../heat-map/heat-map';

const formatWeekday = (weekday: number) => {
  return ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][weekday] || '';
};

const parsingDataFromUTC = (
  data: {
    x: number;
    y: number;
    density: number;
  }[],
) => {
  const timeZoneOffset = new Date().getTimezoneOffset() / 60;
  const densities = data.reduce(
    (acc, d) => {
      const clientTime = d.x - timeZoneOffset;
      const dayPlus = clientTime > 24 ? 1 : 0;
      const dayMinus = clientTime < 0 ? -1 : 0;
      const clientDay = d.y + dayPlus + dayMinus;
      const actualPosition = {
        x: clientTime % 24,
        y:
          clientDay <= 7 && clientDay > 0
            ? clientDay
            : ((clientDay + 7) % 7) + 1,
      };
      const positionKey = `${actualPosition.x}-${actualPosition.y}`;
      acc[positionKey] = d.density;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Array.from({ length: 7 * 24 }, (_, i) => {
    const x = i % 24;
    const y = Math.floor(i / 24) + 1;
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
      weeklyVariance: data ? parsingDataFromUTC(data) : [],
    };
  }, [data]);
  console.log('dataset==>', dataset);
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
      <div className="h-[400px] min-h-[440px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <HeatMap
            data={dataset}
            tooltip={
              <Tooltip
                content={({ payload }) => {
                  const data = payload && payload[0] && payload[0].payload;
                  const { y, x, density } = data || {};
                  const fromTime = x - 1 < 0 ? 23 : x - 1;
                  const toTime = x;
                  return (
                    <div
                      key={`tooltip-${x}-${y}`}
                      id="tooltip"
                      className="border-primary-200/80 rounded-[12px] border border-neutral-50 bg-white/95 p-4 text-neutral-300 shadow-md"
                    >
                      <p>Opened conversation</p>
                      <p className="font-semibold text-neutral-800">
                        {density}
                      </p>
                      <p>
                        Time range:&nbsp;
                        {`${fromTime}h30 - ${toTime}h30 on ${formatWeekday(y)}`}
                      </p>
                    </div>
                  );
                }}
              />
            }
            yAxisProps={{
              label: {
                value: 'Day of week',
                position: 'top',
              },
              domain: [0, 7],
              tickFormatter: (value: number) => formatWeekday(value),
            }}
            xAxisProps={{
              label: {
                value: 'Hourly',
                position: 'right',
              },
              domain: [0, 23],
              tickFormatter: (value: number) => `${value}`,
            }}
          />
        </ResponsiveContainer>
      </div>
    </section>
  );
}