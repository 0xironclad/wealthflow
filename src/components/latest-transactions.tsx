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
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { LatestTransactionsNoData } from "./empty states/latest-transactions-no-data";
import { useExpenses } from "@/lib/queries";
import LoadingComponent from "./loading-component";

export default function LatestTransactions() {
  const { user, isLoading: isAuthLoading } = useUser();

  const { data: expenses, isLoading } = useExpenses(user?.id ?? '');


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
  if (!user?.id) return null;

  // Check if there are no transactions
  const hasNoTransactions = !expenses || expenses.length === 0;

  if (isAuthLoading || isLoading) {
    return <LoadingComponent title="Latest Transactions" />
  }



  // Return empty state if no transactions
  if (hasNoTransactions) {
    return <LatestTransactionsNoData />;
  }

  return (
    <Card className="h-full flex flex-col relative overflow-hidden border-border/50">
      {/* Decorative background */}
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-chart-2/5 blur-3xl" />

      <CardHeader className="flex-none pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            Latest Transactions
          </CardTitle>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/80">
            <span className="text-xs text-muted-foreground">This Month</span>
            <span className="text-xs font-bold text-foreground">
              {expenses?.length || 0}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto styled-scrollbar p-3 relative z-10">
        <div className="space-y-1">
          {sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={cn(
                "group flex items-center gap-3",
                "p-2.5 rounded-xl",
                "hover:bg-secondary/60",
                "transition-all duration-200",
                "border border-transparent hover:border-border/50"
              )}
            >
              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="flex gap-3 items-center">
                  <div className={cn(
                    "p-2 rounded-xl",
                    transaction.type === "incoming"
                      ? "bg-gradient-to-br from-primary/20 to-primary/5"
                      : "bg-gradient-to-br from-destructive/20 to-destructive/5"
                  )}>
                    {transaction.category === "Food" && (
                      <Utensils className="w-4 h-4 text-muted-foreground" />
                    )}
                    {transaction.category === "Rent" && (
                      <HousePlus className="w-4 h-4 text-muted-foreground" />
                    )}
                    {transaction.category === "Entertainment" && (
                      <MonitorPlay className="w-4 h-4 text-muted-foreground" />
                    )}
                    {transaction.category === "Transport" && (
                      <CarFront className="w-4 h-4 text-muted-foreground" />
                    )}
                    {transaction.category === "Health" && (
                      <HeartPulse className="w-4 h-4 text-muted-foreground" />
                    )}
                    {transaction.category === "Utilities" && (
                      <Droplets className="w-4 h-4 text-muted-foreground" />
                    )}
                    {transaction.category === "Education" && (
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    )}
                    {transaction.category === "Shopping" && (
                      <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    )}
                    {transaction.category === "Other" && (
                      <WalletCards className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium text-foreground">
                      {transaction.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date.toLocaleDateString()}{" "}
                      {transaction.timestamp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-3">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      transaction.type === "incoming"
                        ? "text-primary"
                        : "text-destructive"
                    )}
                  >
                    {transaction.type === "incoming" ? "+" : "-"}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  {transaction.type === "incoming" ? (
                    <ArrowDownLeft className="w-4 h-4 text-primary" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/50 mt-auto p-3 relative z-10">
        <Button className="w-full h-9 gap-2" asChild>
          <Link href="/transaction" prefetch={true}>
            View All Transactions
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
