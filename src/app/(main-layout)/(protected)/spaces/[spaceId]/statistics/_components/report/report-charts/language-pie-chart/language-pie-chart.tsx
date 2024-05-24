'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../chart-colors';
import { useAppStore } from '@/stores/app.store';
const COLORS = [...CHART_COLORS].reverse();
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
export default function LanguagePieChart({
  data = [],
}: {
  data: Array<{
    label: string;
    value: number;
  }>;
}) {
  const isMobile = useAppStore((state) => state.isMobile);
  if (!data) return null;
  const pies = data.length ? data : [{ label: 'None', value: 1 }];
  return (
    <ResponsiveContainer width="100%">
      <PieChart width={200} height={200}>
        <Pie
          data={pies}
          outerRadius={isMobile ? 115 : 105}
          startAngle={90}
          endAngle={-270}
          innerRadius={isMobile ? 90 : 80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
