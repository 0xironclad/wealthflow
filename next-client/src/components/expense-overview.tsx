/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import  ExpenseCard  from "@/components/expense-card";
import { Button } from "@/components/ui/button";
import { ExpenseCardProps } from "@/lib/types";
import { getExpensesById } from "@/server/expense";
import { getSavings } from "@/server/saving";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

export function ExpenseOverview() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const { user, isLoading: isAuthLoading } = useUser();

    const { data: expenses, isLoading: isExpensesLoading } = useQuery({
        queryKey: ['expenses'],
        queryFn: () => getExpensesById(user?.id ?? ''),
        select: (data) => data.map((expense: {
            amount: string;
            type: string;
            date: string;
        }) => ({
            amount: parseFloat(expense.amount),
            type: expense.type,
            date: expense.date
        }))
    });

    const { data: savings, isLoading: isSavingsLoading } = useQuery({
        queryKey: ['savings'],
        queryFn: () => getSavings(user?.id ?? ''),
        select: (data) => data.map((saving: { amount: string }) => ({
            amount: parseFloat(saving.amount)
        }))
    });

    if (isExpensesLoading || isSavingsLoading || isAuthLoading) {
        return (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {[1, 2, 3].map((index) => (
                    <div key={index} className="w-full h-[120px] flex items-center justify-center">
                        <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                ))}
            </div>
        );
    }

    const totalIncome = expenses
        ?.filter((exp: { type: string; date: string | number | Date; }) => exp.type === "income" &&
            new Date(exp.date).getMonth() === currentMonth &&
            new Date(exp.date).getFullYear() === currentYear)
        .reduce((sum: any, exp: { amount: any; }) => sum + exp.amount, 0) ?? 0;

    const totalExpense = expenses
        ?.filter((exp: { type: string; date: string | number | Date; }) => exp.type === "expense" &&
            new Date(exp.date).getMonth() === currentMonth &&
            new Date(exp.date).getFullYear() === currentYear)
        .reduce((sum: any, exp: { amount: any; }) => sum + exp.amount, 0) ?? 0;

    const totalSavings = savings?.reduce((sum: any, save: { amount: any; }) => sum + save.amount, 0) ?? 0;

    const lastMonthIncome = expenses
        ?.filter((exp: { type: string; date: string | number | Date; }) => exp.type === "income" &&
            ((currentMonth === 0 && new Date(exp.date).getMonth() === 11 && new Date(exp.date).getFullYear() === currentYear - 1) ||
                (currentMonth > 0 && new Date(exp.date).getMonth() === currentMonth - 1 && new Date(exp.date).getFullYear() === currentYear)))
        .reduce((sum: any, exp: { amount: any; }) => sum + exp.amount, 0) ?? 0;

    const lastMonthExpense = expenses
        ?.filter((exp: { type: string; date: string | number | Date; }) => exp.type === "expense" &&
            ((currentMonth === 0 && new Date(exp.date).getMonth() === 11 && new Date(exp.date).getFullYear() === currentYear - 1) ||
                (currentMonth > 0 && new Date(exp.date).getMonth() === currentMonth - 1 && new Date(exp.date).getFullYear() === currentYear)))
        .reduce((sum: any, exp: { amount: any; }) => sum + exp.amount, 0) ?? 0;

    const data: ExpenseCardProps[] = [
        {
            name: "This Month Income",
            amount: totalIncome,
            percentageChange: lastMonthIncome === 0 ? 0 : (totalIncome - lastMonthIncome) / lastMonthIncome * 100,
            type: "income"
        },
        {
            name: "This Month Expense",
            amount: totalExpense,
            percentageChange: lastMonthExpense === 0 ? 0 : (totalExpense - lastMonthExpense) / lastMonthExpense * 100,
            type: "expense"
        },
        {
            name: "Savings",
            amount: totalSavings,
            percentageChange: 15,
        },
    ];

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {data.map((item, index) => (
                <div key={index} className="w-full">
                    <ExpenseCard {...item} />
                </div>
            ))}
            <Button
                variant="default"
                className="h-full min-h-[120px] w-full flex items-center justify-center text-lg font-medium"
            >
                + New Expense
            </Button>
        </div>
    );
}
