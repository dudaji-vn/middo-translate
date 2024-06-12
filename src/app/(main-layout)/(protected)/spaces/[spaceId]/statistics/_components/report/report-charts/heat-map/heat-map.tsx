import React, { useMemo } from 'react';
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
import { useWindowSize } from 'usehooks-ts';
import { CHART_COLORS, CHART_DARK_COLORS } from '../chart-colors';
import { Theme, useAppStore } from '@/stores/app.store';
const breakpoints = [
  { point: -10 },
  { point: 0 },
  {
    point: 1,
  },
  {
    point: 2,
  },
  { point: 3 },
  { point: 5 },
  { point: 8 },
  { point: 13 },
  { point: 21 },
  {
    point: 34,
  },
];
const getHeatGroups = (dataset: any, theme?: Theme) => {
  let remaining = [...dataset];
  const heatGroups = [];

  breakpoints.forEach(({ point }, index) => {
    const colors = theme == 'dark' ? CHART_DARK_COLORS : CHART_COLORS;
    const cellColor = colors[index % colors.length];
    heatGroups.push({
      label: `>= ${point}`,
      color: cellColor,
      data: remaining.filter((d) => d.density >= point),
    });

    remaining = remaining.filter((d) => d.density > point);
  });
  if (remaining.length > 0) {
    heatGroups.push({
      label: `< ${breakpoints.pop()?.point}`,
      color: '#00275C',
      data: remaining,
    });
  }

  return heatGroups;
};

const CustomShape = ({ width = 50, height = 44, ...props }: RectangleProps) => {
  const x = (props.x || 0) - Math.floor(width / 2) + 4;
  const y = (props.y || 0) - 19;
  return (
    <Rectangle
      key={`${props.x}-${props.y}`}
      stroke="white"
      radius={4}
      {...props}
      height={height}
      width={width}
      className='dark:stroke-neutral-950 [&_*]:!fill-neutral-950'
      x={x}
      y={y}
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
  const { width } = useWindowSize();
  const theme = useAppStore(state => state.theme)
  const { shapeWidth, shapeHeight } = useMemo(() => {
    const isMobile = width < 756;
    if (isMobile) {
      return {
        shapeWidth: 40,
        shapeHeight: 40,
      };
    }
    if (width) {
      return {
        shapeWidth: Number(((width - 342) / 24).toFixed(0)),
        shapeHeight: 48,
      };
    }
    return {
      shapeWidth: 50,
      shapeHeight: 48,
    };
  }, [width]);
  const dataset = weeklyVariance.map((i) => ({
    ...i,
    density: baseDensity + i.density,
  }));

  return (
    <ScatterChart
      height={420}
      margin={{
        top: 25,
        right: 60,
        left: 32,
        bottom: 0,
      }}
      {...props}
    >
      <XAxis
        dataKey="x"
        minTickGap={1}
        axisLine={false}
        type="number"
        tickCount={25}
        tickLine={false}
        padding={{ left: Math.max(shapeWidth - 20, 10), right: 30 }}
        className='dark:stroke-neutral-200 [&_*]:!fill-neutral-200'
        {...xAxisProps}
      />
      <YAxis
        dataKey="y"
        axisLine={false}
        tickCount={8}
        interval={0}
        minTickGap={1}
        padding={{ top: 30 }}
        tickLine={false}
        tick={{ fontSize: 16 }}
        className='dark:stroke-neutral-200 [&_*]:!fill-neutral-200'
        {...yAxisProps}
        />

      {getHeatGroups(dataset, theme).map((group, index) => (
        <Scatter
          id="heatmap-scatter"
          name={group.label}
          key={`${group.label}-${index}`}
          data={group.data}
          fill={group.color}
          shape={(props: RectangleProps) => {
            return (
              <CustomShape {...props} width={shapeWidth} height={shapeHeight} />
            );
          }}
        />
      ))}
      {tooltip}
    </ScatterChart>
  );
};
export default HeatMap;
