"use client"

import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"


export function ProgressRadial({ progress }: { progress: number }) {
    const clamped = Math.max(0, Math.min(100, progress))
    const data = [
        { name: "progress", value: clamped },
    ]
    const chartConfig = {
        value: {
            label: "Progress",
            color: "hsl(var(--chart-6))",
        },
    } satisfies ChartConfig
    return (
        <Card className="flex flex-col">
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[150px] w-full">
                    <RadialBarChart
                        data={data}
                        startAngle={90}
                        endAngle={90 - (clamped / 100) * 360}
                        innerRadius={50}
                        outerRadius={70}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[55, 45]}
                        />
                        <RadialBar dataKey="value" background cornerRadius={10} fill="hsl(var(--chart-6))" />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {clamped.toLocaleString()}%
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
