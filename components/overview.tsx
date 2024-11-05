"use client"

import React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from "recharts"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatter } from "@/lib/utils"

interface RevenueData {
  name: string
  total: number
}

interface OverviewProps {
  data: RevenueData[]
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">{label}</div>
          <div className="font-medium text-right">
            ₱{payload[0].value?.toLocaleString()}
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function Overview({ data }: OverviewProps) {
  // Calculate the total revenue for the year
  const totalRevenue = data.reduce((sum, item) => sum + item.total, 0)

  // Find the last two months with non-zero revenue
  const nonZeroMonths = data.filter(item => item.total > 0)
  const currentMonth = nonZeroMonths[nonZeroMonths.length - 1]?.total || 0
  const previousMonth = nonZeroMonths[nonZeroMonths.length - 2]?.total || 0

  // Only calculate trend percentage if previousMonth has a value
  const trendPercentage = previousMonth 
    ? ((currentMonth - previousMonth) / previousMonth) * 100 
    : 0

  // Determine if the trend is up or down
  const isTrendingUp = currentMonth > previousMonth

  // Calculate the maximum value for better Y-axis scaling
  const maxValue = Math.max(...data.map(item => item.total))
  const yAxisMax = Math.ceil(maxValue * 1.2)

  return (
    <Card className="w-full overflow-hidden border bg-gradient-to-b from-background to-background/50 transition-all hover:shadow-md">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Revenue Overview</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Monthly revenue breakdown and analysis
            </CardDescription>
          </div>
          <div className="rounded-lg bg-primary/10 p-4">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold tracking-tight">
          {formatter.format(totalRevenue)}
          </div>
          <div className="text-sm text-muted-foreground">
            Total revenue for the year
          </div>
        </div>
        {previousMonth > 0 && (
          <div className={`inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium ${
            isTrendingUp ? 'bg-green-500/15 text-green-600' : 'bg-red-500/15 text-red-600'
          }`}>
            {isTrendingUp ? (
              <TrendingUp className="mr-2 h-4 w-4" />
            ) : (
              <TrendingDown className="mr-2 h-4 w-4" />
            )}
            {isTrendingUp ? 'trending up' : 'Down'} by {Math.abs(trendPercentage).toFixed(1)}%
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 40,
                bottom: 20,
                left: 40,
              }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="hsl(var(--muted-foreground)/0.2)" 
              />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                dy={10}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₱${value.toLocaleString()}`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total"
                fill="url(#colorTotal)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
                label={{
                  position: 'top',
                  content: ({ value, x, y, width }) => {
                    if (typeof x === 'number' && typeof y === 'number' && typeof width === 'number' && typeof value === 'number') {
                      return (
                        <text
                          x={x + width / 2}
                          y={y - 10}
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                          textAnchor="middle"
                        >
                          ₱{value.toLocaleString()}
                        </text>
                      )
                    }
                    return null
                  },
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}