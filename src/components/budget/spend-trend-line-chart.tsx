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

interface Budget {
    id: number;
    userId: string;
    name: string;
    description: string;
    periodType: string;
    startDate: string;
    endDate: string;
    category: string;
    plannedAmount: number;
    spentAmount: number;
    isRollover: boolean;
}

interface SpendTrendLineChartProps {
    budgets?: Budget[];
    period?: "6months" | "12months";
}

const chartConfig = {
    spent: {
        label: "Amount Spent",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function SpendTrendLineChart({ budgets = [], period = "6months" }: SpendTrendLineChartProps) {
    const chartData = React.useMemo(() => {
        const monthlySpending = new Map<string, { monthKey: string, monthLabel: string, spent: number }>();

        const monthsToShow = period === "6months" ? 6 : 12;

        // Initialize months with 0 spending
        const now = new Date();
        for (let i = monthsToShow - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
            const monthLabel = date.toLocaleDateString('en-US', { month: 'short' });
            monthlySpending.set(monthKey, { monthKey, monthLabel, spent: 0 });
        }

        // Aggregate spending from budgets if available
        if (budgets && budgets.length > 0) {
            budgets.forEach(budget => {
                const startDate = new Date(budget.startDate);
                const monthKey = startDate.toISOString().slice(0, 7);

                if (monthlySpending.has(monthKey)) {
                    const existing = monthlySpending.get(monthKey)!;
                    monthlySpending.set(monthKey, {
                        ...existing,
                        spent: existing.spent + budget.spentAmount
                    });
                }
            });
        }

        // Convert to chart format and sort by date
        return Array.from(monthlySpending.values())
            .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
            .map(({ monthLabel, spent }) => ({
                month: monthLabel,
                spent: Math.round(spent)
            }));
    }, [budgets, period]);

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Budget Spending - Last {period === "6months" ? "6" : "12"} Months</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                    <LineChart
                        key={`${period}-${chartData.length}`}
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
                                    formatter={(value) => [`$${value.toLocaleString()}`]}
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
