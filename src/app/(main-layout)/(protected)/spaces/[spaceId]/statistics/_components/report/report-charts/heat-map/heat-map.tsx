import React, { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Rectangle,
  RectangleProps,
  YAxisProps,
  XAxisProps,
} from 'recharts';
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
const getHeatGroups = (dataset: any) => {
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
  const x = (props.x || 0) - 20;
  const y = (props.y || 0) - 20;
  return (
    <Rectangle
      key={`${props.x}-${props.y}`}
      {...props}
      height={48}
      x={x}
      width={48}
      y={y}
      stroke="white"
      radius={4}
    />
  );
};

const HeatMap = ({
  data: { baseDensity, weeklyVariance = [] },
  yAxisProps,
  xAxisProps,
  tooltip,
  ...props
}: {
  data: {
    baseDensity: number;
    weeklyVariance: {
      x: number;
      y: number;
      density: number;
    }[];
  };
  yAxisProps?: YAxisProps;
  xAxisProps?: XAxisProps;
  tooltip: React.ReactNode;
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
        left: 14,
        bottom: 15,
      }}
      {...props}
    >
      <XAxis
        dataKey="x"
        domain={[0, 23]}
        minTickGap={8}
        type="number"
        tickCount={25}
        tickLine={false}
        padding={{ left: 40, right: 30 }}
        {...xAxisProps}
      />
      <YAxis
        dataKey="y"
        reversed
        tickCount={8}
        interval={0}
        minTickGap={10}
        padding={{ top: 25 }}
        tickLine={false}
        tick={{ fontSize: 16 }}
        domain={[0, 7]}
        {...yAxisProps}
      />

      {getHeatGroups(dataset).map((group, index) => (
        <Scatter
          id="heatmap-scatter"
          name={group.label}
          key={`${group.label}-${index}`}
          data={group.data}
          fill={group.color}
          shape={CustomShape}
        />
      ))}
      {tooltip}
    </ScatterChart>
  );
};
export default HeatMap;
