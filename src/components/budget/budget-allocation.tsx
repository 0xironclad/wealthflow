"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { Progress } from "@/components/ui/progress"
import { PieChart as PieChartIcon } from "lucide-react"

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

interface BudgetAllocationProps {
    budgets?: Budget[];
}

// Chart colors for different categories
const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
];

export function BudgetAllocation({ budgets = [] }: BudgetAllocationProps) {
    // Process budget data for the chart
    const { chartData, chartConfig, totalAmount } = React.useMemo(() => {
        if (!budgets || budgets.length === 0) {
            return {
                chartData: [],
                chartConfig: {} as ChartConfig,
                totalAmount: 0
            };
        }

        // Group budgets by category and aggregate amounts
        const categoryMap = new Map<string, { plannedAmount: number; spentAmount: number }>();

        budgets.forEach(budget => {
            const category = budget.category.toLowerCase();
            const existing = categoryMap.get(category) || { plannedAmount: 0, spentAmount: 0 };

            categoryMap.set(category, {
                plannedAmount: existing.plannedAmount + budget.plannedAmount,
                spentAmount: existing.spentAmount + budget.spentAmount
            });
        });

        // Convert to chart data format
        const processedChartData = Array.from(categoryMap.entries()).map(([category, amounts], index) => ({
            category,
            plannedAmount: amounts.plannedAmount,
            spentAmount: amounts.spentAmount,
            fill: chartColors[index % chartColors.length]
        }));

        // Create dynamic chart config
        const dynamicChartConfig: ChartConfig = {
            amount: {
                label: "Amount",
                color: "hsl(var(--primary))",
            }
        };

        // Add each category to the config
        processedChartData.forEach((item, index) => {
            dynamicChartConfig[item.category] = {
                label: item.category.charAt(0).toUpperCase() + item.category.slice(1),
                color: chartColors[index % chartColors.length],
            };
        });

        const calculatedTotalAmount = processedChartData.reduce((acc, curr) => acc + curr.plannedAmount, 0);

        return {
            chartData: processedChartData,
            chartConfig: dynamicChartConfig,
            totalAmount: calculatedTotalAmount
        };
    }, [budgets]);
    // Show empty state if no data
    if (!budgets || budgets.length === 0 || chartData.length === 0) {
        return (
            <Card className="flex flex-col h-[400px] relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-muted/30 blur-3xl" />
                </div>

                <CardContent className="flex items-center justify-center h-full p-6 relative z-10">
                    <div className="text-center max-w-xs">
                        {/* Illustrated empty state */}
                        <div className="relative mx-auto mb-6 w-24 h-24">
                            {/* Outer ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-dashed border-border/60 animate-[spin_20s_linear_infinite]" />
                            {/* Inner circle with icon */}
                            <div className="absolute inset-3 rounded-full bg-secondary/80 flex items-center justify-center">
                                <PieChartIcon className="h-8 w-8 text-muted-foreground/60" />
                            </div>
                            {/* Decorative dots */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-primary/40" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-muted-foreground/30" />
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            No Budget Allocations
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Create your first budget to visualize how your money is distributed across categories
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        // TODO: Smaller screen fix
        <Card className="flex flex-col h-[400px]">
            <CardContent className="flex gap-4 h-full p-6">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[350px] flex-shrink-0"
                >
                    <PieChart key={`budget-allocation-${chartData.length}`}>
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
                <div className="flex flex-col flex-1 min-h-0">
                    <div className="space-y-4 overflow-y-auto styled-scrollbar pr-2">
                        {chartData.map((item) => (
                            <div key={item.category} className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span className="capitalize">{item.category}</span>
                                    <span>${item.spentAmount.toLocaleString()} / ${item.plannedAmount.toLocaleString()}</span>
                                </div>
                                <Progress
                                    value={Math.round((item.spentAmount / item.plannedAmount) * 100)}
                                    className="[&>div]:bg-current bg-secondary"
                                    style={{ color: chartConfig[item.category as keyof typeof chartConfig]?.color || 'hsl(var(--primary))' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
