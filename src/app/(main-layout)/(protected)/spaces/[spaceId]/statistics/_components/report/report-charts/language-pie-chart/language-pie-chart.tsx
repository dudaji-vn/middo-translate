'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../chart-colors';
import { useCallback, useMemo, useState } from 'react';
import { getCountryNameByCode, getCountryCode } from '@/utils/language-fn';
import { cn } from '@/utils/cn';
import { CircleFlag } from 'react-circle-flags';
import { TLanguageRank } from '@/types/business-statistic.type';
const COLORS = [...CHART_COLORS].reverse();

export default function LanguagePieChart({
  data = [],
  languagesRank = [],
  othersCount,
  ...props
}: {
  data: Array<{
    label: string;
    value: number;
  }>;
  othersCount?: number;
  languagesRank: TLanguageRank;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [selectedPie, setSelectedPie] = useState<{
    label: string;
    value: number;
    index?: number;
  } | null>(null);


  const pies = useMemo(
    () => (data.length ? data : [{ label: 'None', value: 1 }]),
    [data],
  );
  const outlinePie = useMemo(() => {
    if (!selectedPie) return null;
    const start = pies.slice(0, selectedPie?.index).reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    const end = start + (selectedPie?.value || 0);
    const isOthers = selectedPie?.label === 'others';
    return {
      startAngle: 90 - start * 360,
      endAngle: 90 - end * 360,
      count: isOthers
        ? othersCount
        : languagesRank?.find((e) => e.language === selectedPie?.label)?.count,
      flag: isOthers ? null : getCountryCode(selectedPie?.label),
      countryName: isOthers
        ? 'Others'
        : getCountryNameByCode(selectedPie?.label),
    };
  }, [selectedPie, pies]);
  const onTogglePie = (
    entry: { label: string; value: number },
    index: number,
  ) => {
    setSelectedPie({ ...entry, index });
  };

  if (!data) return null;
  return (
    <div {...props} className={cn('relative', props.className)}>
      <ResponsiveContainer width="100%">
        <PieChart width={250} height={250} className={'relative'}>
          <Pie
            data={pies}
            outerRadius={112}
            startAngle={90}
            endAngle={-270}
            innerRadius={88}
            fill={COLORS[4]}
            dataKey="value"
          >
            {data.map((entry, index) => {
              return (
                <>
                  <Cell
                    style={{ outline: 'none' }}
                    onClick={() => onTogglePie(entry, index)}
                    key={`cell-${index}`}
                    className="cursor-pointer"
                    fill={COLORS[index % COLORS.length]}
                  />
                </>
              );
            })}
          </Pie>
          {selectedPie && outlinePie && (
            <Pie
              animationDuration={800}
              animationBegin={outlinePie.startAngle}
              data={[{ value: selectedPie.value }]}
              outerRadius={124}
              innerRadius={116}
              fill={COLORS[(selectedPie.index || 0) % COLORS.length]}
              dataKey="value"
              {...outlinePie}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-16 rounded-full">
        <div
          className={cn('flex size-full flex-col items-center justify-center', {
            hidden: !selectedPie,
          })}
        >
          <div className=" flex flex-row items-center gap-1 font-normal ">
            {outlinePie?.flag && (
              <CircleFlag
                countryCode={outlinePie?.flag || 'us'}
                height={20}
                width={20}
              />
            )}
            <p className="text-base text-neutral-800">
              {outlinePie?.countryName}
            </p>
          </div>
          <p className="text-2xl font-bold text-neutral-800">
            {outlinePie?.count}
          </p>
          <p className="text-base  text-neutral-600">
            {`${((selectedPie?.value || 0) * 100)?.toFixed(0) || 0}%`}
          </p>
        </div>
      </div>
    </div>
  );
}
