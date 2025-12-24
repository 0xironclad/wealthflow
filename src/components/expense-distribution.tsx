"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import TimelyAverage from "./timely-average"
import { PieChartComponent } from "./pie-chart"
import { useMemo } from "react"
import { useUser } from "@/context/UserContext"
import { ExpenseDistributionNoData } from "./empty states/expense-distribution-no-data"
import { useExpenses } from "@/lib/queries"
import LoadingComponent from "./loading-component"

/* eslint-disable @typescript-eslint/no-explicit-any */
const CHART_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))"
];

interface ChartData {
    title: string;
    amount: number;
    fill: string;
}


function ExpenseDetails({ chartData }: { chartData: ChartData[] }) {
    return (
        <div className="flex flex-col space-y-3">
            {chartData.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                    <div
                        className="flex-shrink-0 w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {item.title} - ${item.amount.toFixed(2)}
                    </span>
                </div>
            ))}
        </div>
    )
}

function ExpenseDistribution() {
    const { user, isLoading: isAuthLoading } = useUser();

    const { data: expenses, isLoading } = useExpenses(user?.id ?? '');

    const chartData = useMemo(() => {
        if (!expenses) return [];

        const expensesByCategory = expenses
            .filter((exp: { type: string }) => exp.type === 'expense')
            .reduce((acc: { title: string; amount: any; fill: string }[], curr: { category: string; amount: any }) => {
                const existing = acc.find((item: { title: any }) => item.title === curr.category.toLowerCase());
                if (existing) {
                    existing.amount += curr.amount;
                } else {
                    acc.push({
                        title: curr.category.toLowerCase(),
                        amount: curr.amount,
                        fill: CHART_COLORS[acc.length % CHART_COLORS.length]
                    });
                }
                return acc;
            }, [] as ChartData[]);

        return expensesByCategory.sort((a: { amount: number }, b: { amount: number }) => b.amount - a.amount);
    }, [expenses]);

    const timelyData = useMemo(() => {
        if (!expenses) return [];

        const expenseItems = expenses.filter((exp: { type: string }) => exp.type === 'expense');

        const uniqueMonths = new Set(
            expenseItems.map((exp: { date: string | number | Date }) =>
                new Date(exp.date).toISOString().substring(0, 7)
            )
        );

        const numberOfMonths = uniqueMonths.size || 1;
        const totalExpenses = expenseItems.reduce((sum: any, curr: { amount: any }) => sum + curr.amount, 0);
        const monthlyAverage = totalExpenses / numberOfMonths;
        const weeklyAverage = monthlyAverage / 4.345;
        const dailyAverage = monthlyAverage / 30.44;

        return [
            {
                title: "Daily",
                amount: dailyAverage.toFixed(2)
            },
            {
                title: "Weekly",
                amount: weeklyAverage.toFixed(2)
            },
            {
                title: "Monthly",
                amount: monthlyAverage.toFixed(2)
            }
        ];
    }, [expenses]);

    // Check if there are no expenses
    const hasNoExpenses = !expenses || expenses.filter((exp: { type: string }) => exp.type === 'expense').length === 0;

    if (isAuthLoading || isLoading) {
        return (
            <LoadingComponent title="Expense Distribution" />
        );
    }

    if (hasNoExpenses) {
        return (
            <ExpenseDistributionNoData />
        );
    }

    return (
        <Card className="h-full w-full relative overflow-hidden border-border/50">
            {/* Decorative background */}
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-chart-1/5 blur-3xl" />

            <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-sm font-semibold">Expense Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 h-[calc(100%-3.5rem)] styled-scrollbar relative z-10">
                <div className="grid grid-cols-3 gap-2 flex-shrink-0">
                    {timelyData.map((item, index) => (
                        <TimelyAverage key={index} title={item.title} amount={Number(item.amount)} />
                    ))}
                </div>
                <div className="flex-1 min-h-0 flex flex-row">
                    <div className="w-1/2 h-full flex items-center justify-center p-2">
                        <PieChartComponent chartData={chartData} />
                    </div>
                    <div className="w-1/2 h-full flex items-center overflow-hidden p-2">
                        <div className="max-h-full overflow-y-auto pr-2 styled-scrollbar">
                            <ExpenseDetails chartData={chartData} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ExpenseDistribution
