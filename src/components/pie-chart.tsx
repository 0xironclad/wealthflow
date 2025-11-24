/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
    amount: {
        label: "Amount",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export function PieChartComponent({ chartData }: { chartData: any[] }) {
    return (
        <Card className="flex flex-col border-0 shadow-none">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="amount"
                            nameKey="title"
                            innerRadius="60%"
                            outerRadius="80%"
                            strokeWidth={1}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
