
'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


import { Card, CardContent } from "@/components/ui/card"
import { MAPPED_CHARTS_INFO_KEY, StatisticData, TChartKey } from "@/types/business-statistic.type"
import { useMemo } from "react";


export function BusinessLineChart({
  chartData,
  keyData,
}: { chartData: StatisticData['chart'], keyData: TChartKey }) {
  const data = chartData[keyData];
  const { label: chartLabel, value: chartDataKey } = MAPPED_CHARTS_INFO_KEY[keyData];
  const claryfiedData = useMemo(() => {
    if (!data) {
      console.error('No data for chart');
      return [];
    }
    return data.map((item) => ({
      [chartLabel]: item.label,
      [chartDataKey]: item.value,
    }))

  }, [data, keyData])
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
              <XAxis dataKey="Time" padding={'gap'} className="py-4" />
              <YAxis axisLine={false} tickLine={false} />
              <CartesianGrid stroke="#E6E6E6" vertical={false} className="8" />
              <Tooltip />
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