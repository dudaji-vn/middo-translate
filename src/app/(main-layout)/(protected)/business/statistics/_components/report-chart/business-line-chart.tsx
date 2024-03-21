
'use client'

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/data-display"
import { StatisticData } from "@/types/business-statistic.type"


export function BusinessLineChart({
  data
}: { data: StatisticData['chart'] }) {
  const claryfiedData = data.map((item, index) => {
    return {
      "Time": item.label,
      "New Clients": item.value,
    }
  })

  return (
    <Card className="border-none p-0">
      <CardContent className="p-0">
        <div className="h-[40vh] min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={claryfiedData}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}

            >
              <XAxis dataKey="Time" />
              <YAxis  axisLine={false}  tickLine={false} />
              <CartesianGrid stroke="#E6E6E6" vertical={false} className="8" />
              <Tooltip />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="New Clients"
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