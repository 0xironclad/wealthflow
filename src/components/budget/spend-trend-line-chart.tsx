"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "Apr", spent: 1250 },
    { month: "May", spent: 3200 },
    { month: "Jun", spent: 1950 },
    { month: "Jul", spent: 3400 },
    { month: "Aug", spent: 2750 },
    { month: "Sep", spent: 3100 },
]

const chartConfig = {
    spent: {
        label: "Amount Spent",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function SpendTrendLineChart() {

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Budget Spending - Last 6 Months</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    formatter={(value) => [`$${value.toLocaleString()}`, "Spent"]}
                                />
                            }
                        />
                        <Line
                            dataKey="spent"
                            type="monotone"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={2}
                            dot={{
                                fill: "hsl(var(--chart-1))",
                                strokeWidth: 2,
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
