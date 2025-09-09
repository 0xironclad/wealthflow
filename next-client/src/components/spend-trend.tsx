/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/UserContext"
import { useExpenses } from "@/lib/queries"
import LoadingComponent from "./loading-component"

interface MonthlySpend {
  month: string;
  spent: number;
}

type TimeRange = "1month" | "6months";

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function SpendTrend() {
  const { user, isLoading: isAuthLoading } = useUser();
  const [timeRange, setTimeRange] = useState<TimeRange>("6months");

  const { data: expenses, isLoading } = useExpenses(user?.id || '');


  const chartData = useMemo(() => {
    if (!expenses) return [];

    const today = new Date();
    const months: MonthlySpend[] = [];
    const monthCount = timeRange === "1month" ? 1 : 6;

    if (timeRange === "1month") {
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const weeksInMonth = Math.ceil(daysInMonth / 7);

      for (let i = 0; i < weeksInMonth; i++) {
        const weekStartDay = i * 7 + 1;
        const weekEndDay = Math.min((i + 1) * 7, daysInMonth);
        const label = `${weekStartDay}-${weekEndDay}`;

        months.push({
          month: label,
          spent: 0
        });
      }

      expenses
        .filter((exp: { date: string | number | Date; type: string }) => {
          const expDate = new Date(exp.date);
          return exp.type === 'expense' &&
            expDate.getMonth() === currentMonth &&
            expDate.getFullYear() === currentYear;
        })
        .forEach((expense: { date: string | number | Date; amount: number }) => {
          const expDate = new Date(expense.date);
          const dayOfMonth = expDate.getDate();
          const weekIndex = Math.floor((dayOfMonth - 1) / 7);

          if (weekIndex >= 0 && weekIndex < months.length) {
            months[weekIndex].spent += expense.amount;
          }
        });
    } else {
      for (let i = monthCount - 1; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
          month: date.toLocaleString('default', { month: 'long' }),
          spent: 0
        });
      }

      expenses
        .filter((exp: { type: string }) => exp.type === 'expense')
        .forEach((expense: { date: string | number | Date; amount: number }) => {
          const expenseDate = new Date(expense.date);
          const monthDiff = (today.getMonth() + 12 * today.getFullYear()) -
            (expenseDate.getMonth() + 12 * expenseDate.getFullYear());

          if (monthDiff >= 0 && monthDiff < monthCount) {
            const monthIndex = months.findIndex(
              m => m.month === expenseDate.toLocaleString('default', { month: 'long' })
            );

            if (monthIndex !== -1) {
              months[monthIndex].spent += expense.amount;
            }
          }
        });
    }

    return months;
  }, [expenses, timeRange]);

  if (!user?.id) return null;

  if (isLoading || isAuthLoading) {
    return (
      <LoadingComponent title="Money spent" />
    );
  }

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
  };

  const chartTitle = timeRange === "1month" ? "This Month" : "Last 6 Months";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Money spent</CardTitle>
          <CardDescription>
            Money spent in {chartTitle}
          </CardDescription>
        </div>
        <div className="flex rounded-md border border-input p-0.5 bg-background">
          <button
            onClick={() => handleTimeRangeChange("1month")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-sm transition-colors",
              timeRange === "1month"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            1M
          </button>
          <button
            onClick={() => handleTimeRangeChange("6months")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-sm transition-colors",
              timeRange === "6months"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            6M
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 30,
              bottom: 0
            }}
            height={220}
            width={500}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => timeRange === "1month" ? value : value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="spent"
              type="natural"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
