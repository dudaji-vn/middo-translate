'use client';

import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../chart-colors';
import { useAppStore } from '@/stores/app.store';
import { useState } from 'react';
import { getCountryNameByCode } from '@/utils/language-fn';
const COLORS = [...CHART_COLORS].reverse();
function CustomLabel(props: any) {
  const { cx, cy } = props.viewBox;
  return (
    <>
      <text
        x={cx}
        y={cy - 5}
        fill="rgba(0, 0, 0, 0.87)"
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan alignmentBaseline="middle" fontSize="28px" fontFamily="Roboto">
          {props.value1}
        </tspan>
      </text>
      <text
        x={cx}
        y={cy + 20}
        fill="rgba(0, 0, 0, 0.54)"
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan fontSize="16px" fontFamily="Roboto">
          {props.value2}
        </tspan>
      </text>
    </>
  );
}

export default function LanguagePieChart({
  data = [],
}: {
  data: Array<{
    label: string;
    value: number;
  }>;
}) {
  const isMobile = useAppStore((state) => state.isMobile);
  const [selectedPie, setSelectedPie] = useState<{
    label: string;
    value: number;
  } | null>(null);
  if (!data) return null;
  const pies = data.length ? data : [{ label: 'None', value: 1 }];

  const onTogglePie = (entry: { label: string; value: number }) => {
    if (selectedPie === entry) {
      setSelectedPie(null);
    } else {
      setSelectedPie(entry);
    }
  };

  return (
    <ResponsiveContainer width="100%">
      <PieChart width={200} height={200} className={'relative'}>
        <Pie
          data={pies}
          outerRadius={isMobile ? 110 : 100}
          startAngle={90}
          endAngle={-270}
          innerRadius={isMobile ? 85 : 75}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => {
            return (
              <>
                <Cell
                  onClick={() => onTogglePie(entry)}
                  key={`cell-${index}`}
                  className="cursor-pointer"
                  fill={COLORS[index % COLORS.length]}
                />
              </>
            );
          })}
          {selectedPie && (
            // <Label
            //   value={selectedPie.label}
            //   content={({ value }) => {
            //     console.log('value', value);
            //     return (
            //       <CircleFlag
            //         countryCode={getCountryCode(selectedPie.label) || 'US'}
            //         height={isMobile ? 20 : 16}
            //         width={isMobile ? 20 : 16}
            //       />
            //     );
            //   }}
            //   position="center"
            //   fill="#000"
            //   fontSize={isMobile ? 20 : 16}
            // />
            <>
              {/* <Label
                value={getCountryNameByCode(selectedPie.label)}
                position="centerBottom"
                className="label-top"
                fontSize="14px"
              />
              <Label
                value={(selectedPie.value * 100)?.toFixed(2) + '%'}
                position="centerTop"
                fontSize="14px"
              /> */}
            </>
          )}
          {selectedPie && (
            <Label
              width={30}
              position="center"
              content={
                <CustomLabel
                  value1={getCountryNameByCode(selectedPie?.label)}
                  value2={(selectedPie.value * 100)?.toFixed(0) + '%'}
                />
              }
            ></Label>
          )}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
