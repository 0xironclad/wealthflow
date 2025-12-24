/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// Simple config just to satisfy ChartContainer, we drive colors via data.fill
const chartConfig: ChartConfig = {
    amount: {
        label: "Amount",
    },
}

export function PieChartComponent({ chartData }: { chartData: any[] }) {
    if (!chartData || chartData.length === 0) {
        return null
    }

    return (
        <ChartContainer
            config={chartConfig}
            className="h-full w-full aspect-square"
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
                />
            </PieChart>
        </ChartContainer>
    )
}
