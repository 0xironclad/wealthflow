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
import { Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getExpensesById } from "@/server/expense"
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
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
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
        <Card className="h-full w-full">
            <CardHeader className="pb-3">
                <div>
                    <CardTitle className="text-sm">Expense Distribution</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 h-[calc(100%-4rem)] styled-scrollbar">
                <div className="grid grid-cols-3 gap-4">
                    {timelyData.map((item, index) => (
                        <TimelyAverage key={index} title={item.title} amount={Number(item.amount)} />
                    ))}
                </div>
                <div className="flex flex-row gap-4 min-h-0 flex-1">
                    <div className="flex-shrink-0 w-[200px]">
                        <PieChartComponent chartData={chartData} />
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <div className="h-full overflow-y-auto pr-2">
                            <ExpenseDetails chartData={chartData} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ExpenseDistribution
