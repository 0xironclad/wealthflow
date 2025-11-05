/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import _ from 'lodash';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wallet, QrCode, Plus, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getIncomesById, getTotalIncome } from "@/server/income";
import { useUser } from '@/context/UserContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IncomeForm } from "./income/income-form"
import { useMutation } from "@tanstack/react-query"
import { createIncome } from "@/server/income"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { formSchema } from "./income/income-form"

export default function AccountsCard() {
  const { user, isLoading: isAuthLoading } = useUser();
  const { toast } = useToast()
  
  console.log('[AccountsCard] Render - user:', user?.email, 'userId:', user?.id, 'isLoading:', isAuthLoading);

  const { data: incomes, error } = useQuery({
    queryKey: ['incomes', user?.id],
    queryFn: () => {
      console.log('[Accounts] Fetching incomes for user:', user?.id);
      return getIncomesById(user?.id ?? '');
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
    select: (response) => {
      if (!response || response.length == 0) return [];
      const groupedIncomes = _.chain(response)
        .groupBy('category')
        .map((categoryIncomes: any[], category: string) => ({
          id: category,
          title: category,
          balance: `$${_.sumBy(categoryIncomes, income => Number(income.amount)).toLocaleString()}`,
          description: `${categoryIncomes.length} transactions`,
          type: "savings"
        }))
        .value();

      return groupedIncomes;
    }
  });

  const { data: totalBalance, isLoading: totalIncomeLoading } = useQuery({
    queryKey: ['totalBalance', user?.id],
    queryFn: () => getTotalIncome(user?.id as string),
    refetchOnWindowFocus: false,
    enabled: !!user?.id,
    select: (response) => {
      const amount = typeof response === 'string' ?
        parseFloat(response.replace(/[^0-9.-]+/g, "")) :
        Number(response);
      return `$${amount.toLocaleString()}`
    },
    retry: 1
  });


  const queryClient = useQueryClient()

  const createIncomeMutation = useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['monthly-income'] })
      queryClient.invalidateQueries({ queryKey: ['totalBalance'] })
      toast({
        title: "Success",
        description: "Income added successfully",
      })
    },
    onError: (error) => {
      console.error('Income creation error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add income. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleAddIncome = async (data: z.infer<typeof formSchema>) => {
    createIncomeMutation.mutate({
      userId: user?.id as string,
      ...data,
    })
  }

  if (isAuthLoading || totalIncomeLoading) {
    return (
      <Card className="h-full w-full">
        <CardHeader className="p-3 border-b">
          <p className="text-xs text-muted-foreground">Total Balance</p>
          <CardTitle className="text-2xl font-semibold">$0</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (<Card className="h-full w-full">
      <CardHeader className="p-3 border-b">
        <p className="text-xs text-muted-foreground">Total Balance</p>
        <CardTitle className="text-2xl font-semibold">{0}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[200px]">
        Error loading accounts
      </CardContent>
    </Card>
    );
  }

  if (!incomes || incomes.length === 0 || !Array.isArray(incomes)) {
    return (
      <Card className="h-full w-full relative flex flex-col">
        <CardHeader className="p-3 border-b">
          <p className="text-xs text-muted-foreground">Total Balance</p>
          <CardTitle className="text-2xl font-semibold">
            {totalBalance ?? '$0'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-6 px-4 text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Wallet className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-chart-2" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                No income sources yet
              </h3>
            </div>

            <div className="flex flex-col space-y-3 w-full max-w-xs">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Income
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Income</DialogTitle>
                    <DialogDescription>
                      Add a new income source to your account
                    </DialogDescription>
                  </DialogHeader>
                  <IncomeForm onSubmit={handleAddIncome} />
                </DialogContent>
              </Dialog>

              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded-full bg-chart-1/20 flex items-center justify-center">
                    <CreditCard className="w-3 h-3 text-chart-1" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-chart-2/20 flex items-center justify-center">
                    <Wallet className="w-3 h-3 text-chart-2" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-chart-3/20 flex items-center justify-center">
                    <QrCode className="w-3 h-3 text-chart-3" />
                  </div>
                </div>
                <span>Track salary, freelance & more</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  const displayAccounts = incomes
  return (
    <Card className="h-full w-full relative flex flex-col">
      <CardHeader className="p-3 border-b">
        <p className="text-xs text-muted-foreground">Total Balance</p>
        {totalIncomeLoading ? (
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        ) : (
          <CardTitle className="text-2xl font-semibold">
            {totalBalance ?? '$0'}
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto styled-scrollbar">
        <h2 className="text-xs font-medium mb-2">Your Accounts</h2>

        <div className="space-y-1">
          {(displayAccounts ?? []).map((account: {
            id: string;
            title: string;
            balance: string;
            description?: string;
            type: string;
          }) => (
            <div
              key={account.id}
              className={cn(
                "group flex items-center justify-between",
                "p-2 rounded-lg",
                "hover:bg-accent/50",
                "transition-all duration-200",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("p-1.5 rounded-lg bg-primary/10",
                  )}
                >
                  {account.type === "savings" && (
                    <Wallet className="w-3.5 h-3.5 text-primary" />
                  )}
                  {account.type === "checking" && (
                    <QrCode className="w-3.5 h-3.5 text-primary" />
                  )}
                  {account.type === "investment" && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                  )}
                  {account.type === "debt" && (
                    <CreditCard className="w-3.5 h-3.5 text-destructive" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-medium">{account.title}</h3>
                  {account.description && (
                    <p className="text-[11px] text-muted-foreground">{account.description}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className={cn(
                  "text-xs font-medium",
                  account.type === "debt" && "text-destructive"
                )}>
                  {account.balance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-2 border-t grid grid-cols-2 gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-auto py-2 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
              <DialogDescription>
                Add a new income source to your account
              </DialogDescription>
            </DialogHeader>
            <IncomeForm onSubmit={handleAddIncome} />
          </DialogContent>
        </Dialog>
        <Button size="sm" variant={"secondary"} className="h-auto py-2 flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Manage</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
