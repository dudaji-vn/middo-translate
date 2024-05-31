'use client';

import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import React, { useMemo } from 'react';
import { ResponsiveContainer, Tooltip } from 'recharts';
import HeatMap from '../heat-map/heat-map';
import { mappedFilterByIcon } from '../business-line-chart/business-line-chart';
import { getCountryCode, getCountryNameByCode } from '@/utils/language-fn';
import { CircleFlag } from 'react-circle-flags';
import { useTranslation } from 'react-i18next';

const formatWeekday = (weekday: number) => {
  return ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][weekday] || '';
};
type CountConversation = {
  count: number;
  language: string;
};
const parsingDataFromUTC = (
  data: {
    x: number;
    y: number;
    density: number;
    openedConversation: CountConversation[];
  }[],
) => {
  const timeZoneOffset = new Date().getTimezoneOffset() / 60;
  let countOpened: Record<string, CountConversation[]> = {};
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
      countOpened[positionKey] = d.openedConversation;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Array.from({ length: 7 * 24 }, (_, i) => {
    const x = i % 24;
    const y = Math.floor(i / 24) + 1;
    const positionKey = `${x}-${y}`;
    const density = densities[positionKey] || 0;
    return {
      x: x,
      y: y,
      density: density,
      openedConversation: countOpened[positionKey] || [],
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
    openedConversation: Array<{
      count: number;
      language: string;
    }>;
  }[];
  displayFilterBy?: string;
}) {
  const { t } = useTranslation('common');
  const dataset = useMemo(() => {
    console.log('data', data);
    return {
      baseDensity: 0,
      weeklyVariance: data ? parsingDataFromUTC(data) : [],
    };
  }, [data]);
  return (
    <section className="relative  w-full space-y-4  bg-white  px-3  py-4 md:px-10">
      <Typography className="flex flex-row items-center justify-start gap-2 text-base font-semibold text-neutral-800">
        {t('EXTENSION.CHART.TRAFFICTRACK')}
        <span
          className={cn(
            'flex flex-row items-center gap-2 font-normal text-neutral-800',
            {
              hidden: !displayFilterBy,
            },
          )}
        >
          {mappedFilterByIcon['domain']}
          {displayFilterBy}
        </span>
      </Typography>
      <div className="max-md:overflow-x-auto">
        <div className="h-[400px] min-h-[440px] w-full  min-w-[756px]">
          <ResponsiveContainer width="100%" height="100%">
            <HeatMap
              data={dataset}
              tooltip={
                <Tooltip
                  content={({ payload }) => {
                    const data = payload && payload[0] && payload[0].payload;
                    const { y, x, density, openedConversation } = data || {};
                    const fromTime = x - 1 < 0 ? 23 : x - 1;
                    const toTime = x;
                    return (
                      <div
                        key={`tooltip-${x}-${y}`}
                        id="tooltip"
                        className="border-primary-200/80 h-fit rounded-[12px] border border-neutral-50 bg-white/95 p-4 text-neutral-300  shadow-md"
                      >
                        <p className="font-medium">Opened conversation</p>
                        <p className="font-semibold text-neutral-800">
                          {density}
                        </p>
                        <p>
                          {`${fromTime}h30 - ${toTime}h30 on ${formatWeekday(y)}`}
                        </p>
                        {openedConversation && (
                          <div className="flex flex-col gap-2 py-2">
                            {openedConversation.map(
                              ({ count, language }: CountConversation) => (
                                <div
                                  key={language}
                                  className="flex flex-row items-center gap-2"
                                >
                                  <CircleFlag
                                    countryCode={
                                      getCountryCode(language) || 'us'
                                    }
                                    height={20}
                                    width={20}
                                  />
                                  <Typography className="line-clamp-1 max-w-32 font-normal text-neutral-800">
                                    {getCountryNameByCode(language)}
                                  </Typography>
                                  <Typography className="text-base font-normal text-neutral-800">
                                    {count}
                                  </Typography>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              }
              yAxisProps={{
                label: {
                  value: t('COMMON.WEEKDAY.TITLE'),
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
      </div>
    </section>
  );
}
