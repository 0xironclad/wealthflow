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
        <Card className="flex flex-col border-0 shadow-none bg-transparent">
            <CardContent className="flex items-center justify-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto h-52 w-52"
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
            </CardContent>
        </Card>
    )
}
