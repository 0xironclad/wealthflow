/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
import { Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getExpensesById } from "@/server/expense"
import { getIncomesById } from "@/server/income"
import { useUser } from "@/context/UserContext"

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

type TimeRange = "1month" | "6months";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function IncomeVSExpense() {
  const [timeRange, setTimeRange] = useState<TimeRange>("6months");
  const { user, isLoading: isAuthLoading } = useUser();

  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: () => getExpensesById(user?.id ?? ''),
    enabled: !!user?.id,
    select: (data) => data.map((expense: {
      id: number;
      userid: string;
      name: string;
      date: string;
      amount: string;
      type: 'income' | 'expense';
      paymentmethod: string;
      category: string;
    }) => ({
      id: expense.id,
      userId: expense.userid,
      name: expense.name,
      date: expense.date,
      amount: parseFloat(expense.amount),
      type: expense.type,
      paymentMethod: expense.paymentmethod,
      category: expense.category
    }))
  });

  const { data: incomes, isLoading: isLoadingIncomes } = useQuery({
    queryKey: ['incomes', user?.id],
    queryFn: () => getIncomesById(user?.id ?? ''),
    enabled: !!user?.id,
    select: (data) => data.map((income: {
      id: number;
      userid: string;
      name: string;
      date: string;
      amount: string;
      category: string;
      source: string;
    }) => ({
      id: income.id,
      userId: income.userid,
      name: income.name,
      date: income.date,
      amount: parseFloat(income.amount),
      type: 'income',
      category: income.category,
      source: income.source
    }))
  });

  const chartData = useMemo(() => {
    if (!expenses || !incomes) return [];

    const today = new Date();
    const allTransactions = [...expenses, ...incomes];

    if (timeRange === "1month") {
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      const weeksInMonth = Math.ceil(daysInMonth / 7);
      const weeks: ChartData[] = [];

      for (let i = 0; i < weeksInMonth; i++) {
        const weekStartDay = i * 7 + 1;
        const weekEndDay = Math.min((i + 1) * 7, daysInMonth);
        const label = `${weekStartDay}-${weekEndDay}`;

        weeks.push({
          month: label,
          income: 0,
          expense: 0
        });
      }

      allTransactions.forEach((transaction: any) => {
        const transactionDate = new Date(transaction.date);

        if (transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear) {

          const dayOfMonth = transactionDate.getDate();
          const weekIndex = Math.floor((dayOfMonth - 1) / 7);

          if (weekIndex >= 0 && weekIndex < weeks.length) {
            if (transaction.type === 'income') {
              weeks[weekIndex].income += transaction.amount;
            } else {
              weeks[weekIndex].expense += transaction.amount;
            }
          }
        }
      });

      return weeks;
    } else {
      const months: ChartData[] = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
          month: date.toLocaleString('default', { month: 'long' }),
          income: 0,
          expense: 0
        });
      }

      allTransactions.forEach((transaction: any) => {
        const transactionDate = new Date(transaction.date);
        const monthIndex = months.findIndex(
          m => m.month === transactionDate.toLocaleString('default', { month: 'long' })
        );

        if (monthIndex !== -1) {
          if (transaction.type === 'income') {
            months[monthIndex].income += transaction.amount;
          } else {
            months[monthIndex].expense += transaction.amount;
          }
        }
      });

      return months;
    }
  }, [expenses, incomes, timeRange]);

  const dateRangeText = useMemo(() => {
    if (timeRange === "1month") {
      const today = new Date();
      return today.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else {
      if (chartData.length >= 2) {
        return `${chartData[0].month} - ${chartData[chartData.length - 1].month} ${new Date().getFullYear()}`;
      }
      return "";
    }
  }, [chartData, timeRange]);

  if (isAuthLoading || isLoadingExpenses || isLoadingIncomes) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Income vs Expense</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Income vs Expense</CardTitle>
          <CardDescription>{dateRangeText}</CardDescription>
        </div>
        <div className="flex rounded-md border border-input p-0.5 bg-background">
          <button
            onClick={() => handleTimeRangeChange("1month")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-sm transition-colors",
              timeRange === "1month"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            6M
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            data={chartData}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }}
            height={180}
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
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="hsl(var(--chart-2))" radius={4} />
            <Bar dataKey="expense" fill="hsl(var(--chart-5))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
