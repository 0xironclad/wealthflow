"use client"

import { Bar, BarChart, XAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"

interface BudgetData {
  name: string
  remainingAmount: number
  spentAmount: number
}

const chartData: BudgetData[] = [
  { name: "Groceries", remainingAmount: 50, spentAmount: 450 },
  { name: "Transportation", remainingAmount: 0, spentAmount: 400 },
  { name: "Entertainment", remainingAmount: 80, spentAmount: 220 },
  { name: "Utilities", remainingAmount: 20, spentAmount: 180 },
  { name: "Dining Out", remainingAmount: 70, spentAmount: 320 },
  { name: "Shopping", remainingAmount: 50, spentAmount: 150 },
]

const chartConfig = {
  remainingAmount: {
    label: "Remaining",
    color: "hsl(var(--chart-6))",
  },
  spentAmount: {
    label: "Spent",
    color: "hsl(var(--chart-6) / 0.1)",
  },
} satisfies ChartConfig

export function BudgetsTooltip() {
  return (
    <Card className="h-full max-h-full flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-base">Remaining budget</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-3 overflow-hidden">
        <ChartContainer config={chartConfig} className="h-full max-h-full w-full">
          <BarChart accessibilityLayer data={chartData} barCategoryGap="5%">
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return value.length > 6 ? value.substring(0, 6) + "..." : value
              }}
            />
            <Bar dataKey="remainingAmount" stackId="a" fill="var(--color-remainingAmount)" radius={[0, 0, 4, 4]} maxBarSize={30} />
            <Bar dataKey="spentAmount" stackId="a" fill="var(--color-spentAmount)" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return value
                  }}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
