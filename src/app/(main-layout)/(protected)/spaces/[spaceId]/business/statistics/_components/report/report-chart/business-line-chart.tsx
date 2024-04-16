
'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


import { Card, CardContent } from "@/components/ui/card"
import { MAPPED_CHARTS_INFO_KEY, StatisticData, TChartKey } from "@/types/business-statistic.type"
import { use, useMemo } from "react";
import moment from "moment";
import { accurateHumanize } from "@/utils/moment";

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  const { value } = payload?.[0] || {};
  const suffix = unit ? `(${unit}${value <= 1 ? '' : 's'})` : '';
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-neutral-200 p-4 rounded-lg">
        <p className="text-neutral-600 text-sm">{`${label}`}</p>
        <p className="text-neutral-800 text-base flex flex-row gap-1">{`${value}`}<span>{suffix}</span></p>
      </div>
    )
  }

  return null;
};

export function BusinessLineChart({
  reportData,
  keyData,
}: { reportData: StatisticData, keyData: TChartKey }) {

  const { label: chartLabel, value: chartDataKey } = MAPPED_CHARTS_INFO_KEY[keyData];
  const unit = useMemo(() => {
    switch (keyData) {
      case 'responseChat':
        return accurateHumanize(moment.duration(reportData.responseChat.averageTime, 'milliseconds'), 1).maxUnit;
      case 'client':
        return 'people'
      case 'completedConversation':
        return 'conversations'
      case 'averageRating':
        return 'stars'
      default:
        return null
    }
  }, [keyData, reportData]);
  const claryfiedData = useMemo(() => {
    const chartData = reportData.chart;
    if (!chartData || !chartData[keyData]) {
      console.error('No data for chart');
      return [[], []];
    }
    let convertedData = chartData[keyData] || [];
    if (keyData === 'responseChat') {
      return convertedData.map(({ label, value }) => {
        const unit =accurateHumanize(moment.duration(reportData.responseChat.averageTime, 'milliseconds'), 1).maxUnit; 
        return {
          [chartLabel]: label,
          [chartDataKey]: unit && value ? moment.duration(value, 'milliseconds').as(unit).toFixed(1) : value
        }
      })
    }
    return convertedData.map((item) => ({
      [chartLabel]: item.label,
      [chartDataKey]: item.value.toFixed(0)
    })) || [];

  }, [reportData, keyData]);

  return (
    <Card className="border-none p-0">
      <CardContent className="p-0">
        <div className="h-[40vh] min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={claryfiedData}
              margin={{
                top: 15,
                right: 0,
                left: 0,
                bottom: 15,
              }}

            >
              <XAxis dataKey={chartLabel} padding={'gap'} className="py-4" />
              <YAxis axisLine={false} tickLine={false} />
              <CartesianGrid stroke="#E6E6E6" vertical={false} className="8" />
              <Tooltip
                content={<CustomTooltip unit={unit} />}
              />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey={chartDataKey}
                activeDot={{
                  r: 8,
                  className: "fill-primary-500-main stroke-primary-500-main w-[1rem] h-[1rem]",
                }}
                dot={{
                  r: 0,
                  className: "fill-none stroke-primary-500-main ",
                }}
                className=" stroke-primary-500-main"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

  )
}