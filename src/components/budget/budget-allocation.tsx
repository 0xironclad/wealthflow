"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { Progress } from "@/components/ui/progress"

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

const chartData = [
    { category: "groceries", plannedAmount: 450, spentAmount: 50, fill: "var(--color-groceries)" },
    { category: "transportation", plannedAmount: 320, spentAmount: 230, fill: "var(--color-transportation)" },
    { category: "entertainment", plannedAmount: 280, spentAmount: 20, fill: "var(--color-entertainment)" },
    { category: "utilities", plannedAmount: 200, spentAmount: 130, fill: "var(--color-utilities)" },
    { category: "dining", plannedAmount: 180, spentAmount: 110, fill: "var(--color-dining)" },
    { category: "shopping", plannedAmount: 150, spentAmount: 70, fill: "var(--color-shopping)" },
]


const chartConfig = {
    amount: {
        label: "Amount",
    },
    groceries: {
        label: "Groceries",
        color: "hsl(var(--chart-1))",
    },
    transportation: {
        label: "Transportation",
        color: "hsl(var(--chart-2))",
    },
    entertainment: {
        label: "Entertainment",
        color: "hsl(var(--chart-3))",
    },
    utilities: {
        label: "Utilities",
        color: "hsl(var(--chart-4))",
    },
    dining: {
        label: "Dining",
        color: "hsl(var(--chart-5))",
    },
    shopping: {
        label: "Shopping",
        color: "hsl(var(--chart-6))",
    },
} satisfies ChartConfig

export function BudgetAllocation() {
    const totalAmount = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.plannedAmount, 0)
    }, [])
    return (
        <Card className="flex flex-col h-[400px]">
            <CardContent className="flex gap-4 flex-1 pb-0 items-center">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square max-h-[350px] flex-shrink-0"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="plannedAmount"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                        >
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
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    ${totalAmount.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total Budget
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="flex flex-col flex-1 justify-center space-y-4 p-3">
                    {
                        chartData.map((item) => (
                            <div key={item.category} className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span className="capitalize">{item.category}</span>
                                    <span>${item.spentAmount} / ${item.plannedAmount}</span>
                                </div>
                                <Progress
                                    value={Math.round((item.spentAmount / item.plannedAmount) * 100)}
                                    className="[&>div]:bg-current bg-secondary"
                                    style={{ color: chartConfig[item.category as keyof typeof chartConfig]?.label }}
                                />
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}
