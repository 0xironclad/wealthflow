/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownLeft,
  HeartPulse,
  Droplets,
  GraduationCap,
  ShoppingCart,
  WalletCards,
  Utensils,
  HousePlus,
  MonitorPlay,
  CarFront,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getExpensesById } from "@/server/expense";
import { useUser } from "@/context/UserContext";

export default function LatestTransactions() {
  const { user, isLoading: isAuthLoading } = useUser();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: () => user ? getExpensesById(user.id) : null,
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
    select: (data) => data?.map((expense: { id: any; userid: any; name: any; date: any; amount: string; type: any; paymentmethod: any; category: any }) => ({
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

  const sortedTransactions = useMemo(() => {
    if (!expenses) return [];

    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .map((transaction) => ({
        id: transaction.id || Math.random().toString(),
        title: transaction.name,
        amount:
          transaction.type === "expense"
            ? -transaction.amount
            : transaction.amount,
        type: transaction.type === "expense" ? "outgoing" : "incoming",
        timestamp: new Date(transaction.date).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        date: new Date(transaction.date),
        category: transaction.category,
      }));
  }, [expenses]);

  if (isAuthLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Latest Transactions
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }



  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Latest Transactions
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Latest Transactions
            </CardTitle>
          </div>
          <CardDescription className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0">
            This Month-
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
              {expenses?.length || 0}
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent styled-scrollbar">
        <div className="space-y-1">
          {sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={cn(
                "group flex items-center gap-3",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200"
              )}
            >
              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="flex gap-2 items-center">
                  {transaction.category === "Food" && (
                    <Utensils className="text-zinc-900 dark:text-zinc-100" />
                  )}
                  {transaction.category === "Rent" && (
                    <HousePlus className="text-zinc-900 dark:text-zinc-100" />
                  )}
                  {transaction.category === "Entertainment" && (
                    <MonitorPlay className="text-zinc-900 dark:text-zinc-100" />
                  )}
                  {transaction.category === "Transport" && (
                    <CarFront className="text-zinc-900 dark:text-zinc-100" />
                  )}
                  {transaction.category === "Health" && (
                    <HeartPulse className="text-zinc-900 dark:text-zinc-100" />
                  )}
                  {transaction.category === "Utilities" && (
                    <Droplets className="text-zinc-900 dark:text-zinc-100" />
                  )}
                  {transaction.category === "Education" && (
                    <GraduationCap className="text-zinc-900 dark:text-zinc-100" />
                  )}
                  {transaction.category === "Shopping" && (
                    <ShoppingCart className="text-zinc-900 dark:text-zinc-100" />
                  )}
                  {transaction.category === "Other" && (
                    <WalletCards className="text-zinc-900 dark:text-zinc-100" />
                  )}
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {transaction.title}
                    </h3>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      {transaction.date.toLocaleDateString()}{" "}
                      {transaction.timestamp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-3">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      transaction.type === "incoming"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {transaction.type === "incoming" ? "+" : ""}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  {transaction.type === "incoming" ? (
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t mt-auto p-2">
        <Button className="w-full">
          <Link
            href="/transaction"
            className="flex gap-2 items-center justify-center"
            prefetch={true}
          >
            View All Transactions
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
