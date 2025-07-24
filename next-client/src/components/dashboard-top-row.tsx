"use client";
import {
    Card,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react"
import { getIncomesById } from "@/server/income";
import { getExpensesById } from "@/server/expense";
import { useQuery } from "@tanstack/react-query";
import { InvoiceType, IncomeType, SavingsType } from "@/lib/types";
import { getSavings } from "@/server/saving";
// import dynamic from "next/dynamic";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getBudgetsById } from "@/server/budget";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";

// Dynamic imports
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BudgetManager from "@/components/budget/budget-manager";

interface FinancialMetricCardProps {
    label: string;
    value: number | string;
    percentageChange: number;
    isPositive?: boolean;
}

const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({
    label,
    value,
    percentageChange,
    isPositive = true
}) => {
    return (
        <Card className="border rounded-lg p-3 flex flex-col h-[120px]">
            <CardTitle className="text-xs text-gray-500 mb-1">{label}</CardTitle>
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                    {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
                </span>
                <span
                    className={`text-xs px-2 py-0.5 rounded-full ${isPositive
                        ? ' text-green-600'
                        : ' text-red-600'
                        }`}
                >
                    {isPositive ? '+' : '-'}{Math.abs(percentageChange)}%
                </span>
            </div>
        </Card>
    );
};

type BudgetResponse = {
    success: boolean;
    message?: string;
    data?: Array<{
        id: number;
        user_id: number;
        name: string;
        description: string;
        period_type: string;
        start_date: string;
        end_date: string;
        category: string;
        planned_amount: number;
        spent_amount: number;
        is_rollover: boolean;
    }>;
};

type TransformedBudget = {
    id: number;
    userId: number;
    name: string;
    description: string;
    periodType: string;
    startDate: string;
    endDate: string;
    category: string;
    plannedAmount: number;
    spentAmount: number;
    rollOver: string;
};

const DashboardTopRow: React.FC = () => {
    const queryClient = useQueryClient();
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const { user, isLoading: isLoadingUser } = useUser();

    const { data: incomes, isLoading: isLoadingIncomes } = useQuery({
        queryKey: ['incomes', user?.id],
        refetchOnWindowFocus: false,
        initialData: queryClient.getQueryData(['incomes']),
        queryFn: async () => {
            if (!user) return Promise.resolve([]);
            return getIncomesById(user.id);
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 60,
    });

    const { data: expenses } = useQuery({
        queryKey: ['expenses', user?.id],
        queryFn: () => user ? getExpensesById(user.id) : null,
        enabled: !!user,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        initialData: queryClient.getQueryData(['expenses']),
        select: (data) => data?.map((expense: InvoiceType) => ({
            id: expense.id,
            userId: expense.userId,
            name: expense.name,
            date: expense.date,
            amount: Number(expense.amount),
            type: expense.type,
            paymentMethod: expense.paymentMethod,
            category: expense.category
        }))
    });

    const { data: savings } = useQuery({
        queryKey: ['savings', user?.id],
        queryFn: () => user ? getSavings(user.id) : null,
        enabled: !!user,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        initialData: queryClient.getQueryData(['savings']),
        select: (data) => data?.map((saving: {
            id: number;
            userid: number;
            name: string;
            date: string;
            amount: string | number;
            goal: string | number;
            status: string;
            description: string;
        }) => ({
            id: saving.id,
            userId: saving.userid,
            name: saving.name,
            date: saving.date,
            amount: Number(saving.amount),
            goal: Number(saving.goal),
            status: saving.status,
            description: saving.description
        }))
    });

    const { data: categories, isLoading } = useQuery<BudgetResponse, Error, TransformedBudget[]>({
        queryKey: ['budgets', user?.id],
        staleTime: 1000 * 60 * 60,
        queryFn: () => user ? getBudgetsById(user.id) : Promise.resolve({ success: true, data: [] }),
        enabled: !!user,
        refetchOnWindowFocus: false,
        initialData: queryClient.getQueryData(['budgets']),
        select: (data) => {
            if (!data.success || !data.data) return [];
            return data.data.map((budget) => ({
                id: budget.id,
                userId: budget.user_id,
                name: budget.name,
                description: budget.description,
                periodType: budget.period_type,
                startDate: budget.start_date,
                endDate: budget.end_date,
                category: budget.category,
                plannedAmount: Number(budget.planned_amount),
                spentAmount: Number(budget.spent_amount),
                rollOver: budget.is_rollover ? "Yes" : "No"
            }));
        }
    });


    const isLoadingData = isLoadingUser || isLoadingIncomes;

    if (isLoadingData) {
        return (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                <div className="col-span-1">
                    <Card className="p-3 flex flex-col animate-pulse">
                        <div className="h-4 w-16 bg-muted rounded mb-2"></div>
                        <div className="h-7 w-24 bg-muted-foreground/20 rounded"></div>
                    </Card>
                </div>
                <div className="col-span-1">
                    <Card className="p-3 flex flex-col animate-pulse">
                        <div className="h-4 w-16 bg-muted rounded mb-2"></div>
                        <div className="h-7 w-24 bg-muted-foreground/20 rounded"></div>
                    </Card>
                </div>
                <div className="col-span-1">
                    <Card className="p-3 flex flex-col animate-pulse">
                        <div className="h-4 w-16 bg-muted rounded mb-2"></div>
                        <div className="h-7 w-24 bg-muted-foreground/20 rounded"></div>
                    </Card>
                </div>
                <div className="col-span-3 md:col-span-1">
                    <Card className="p-3 flex flex-col animate-pulse">
                        <div className="h-4 w-16 bg-muted rounded mb-2"></div>
                        <div className="h-7 w-24 bg-muted-foreground/20 rounded"></div>
                    </Card>
                </div>
                <div className="col-span-3 md:col-span-1">
                    <Card className="p-3 flex flex-col animate-pulse">
                        <div className="h-4 w-16 bg-muted rounded mb-2"></div>
                        <div className="h-7 w-24 bg-muted-foreground/20 rounded"></div>
                    </Card>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const netSavings = savings?.reduce((sum: number, saving: SavingsType) => sum + saving.amount, 0) ?? 0;

    const expensesThisMonth = expenses?.filter((expense: InvoiceType) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === today.getMonth() &&
            expenseDate.getFullYear() === today.getFullYear() && expense.type === 'expense';
    }).reduce((sum: number, expense: InvoiceType) => sum + Number(expense.amount), 0) ?? 0;

    const totalIncomeThisMonth = incomes
        ?.filter((income: IncomeType) => {
            const incomeDate = new Date(income.date);
            return incomeDate.getMonth() === today.getMonth() &&
                incomeDate.getFullYear() === today.getFullYear();
        })
        .reduce((sum: number, income: IncomeType) => {
            const amount = typeof income.amount === 'string'
                ? parseFloat(income.amount)
                : Number(income.amount);
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0) ?? 0;

    // budgets
    const totalBudget = categories?.reduce((sum: number, budget: { plannedAmount: number; }) => sum + budget.plannedAmount, 0) ?? 0;
    const totalSpent = categories?.reduce((sum: number, budget: { spentAmount: number; }) => sum + budget.spentAmount, 0) ?? 0;
    const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;


    return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            <div className="col-span-1">
                <FinancialMetricCard
                    label="Income"
                    value={totalIncomeThisMonth}
                    percentageChange={10}
                />
            </div>
            <div className="col-span-1">
                <FinancialMetricCard
                    label="Expenses"
                    value={Number(expensesThisMonth)}
                    percentageChange={10}
                    isPositive={false}
                />
            </div>
            <div className="col-span-1">
                <FinancialMetricCard
                    label="Net Savings"
                    value={Number(netSavings)}
                    percentageChange={20}
                />
            </div>
            <div className="col-span-3 md:col-span-1">
                <Card className="p-3 flex flex-col h-[120px]">
                    <CardTitle className="text-xs text-gray-500 mb-1">Monthly Budget Spent</CardTitle>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                            {isLoading ? 'Loading...' : `${percentUsed}%`}
                        </span>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary" className="w-full mt-2">
                                Manage Budget
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] w-[95vw]">
                            <DialogPrimitive.Title asChild>
                                <VisuallyHidden>Manage Monthly Budget</VisuallyHidden>
                            </DialogPrimitive.Title>
                            <DialogHeader>
                                <DialogTitle>Manage Monthly Budget</DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground">
                                    All your budgets in one place.
                                </DialogDescription>
                            </DialogHeader>
                            <BudgetManager />
                        </DialogContent>
                    </Dialog>
                </Card>
            </div>
            <div className="col-span-3 md:col-span-1">
                <Card className="p-3 flex flex-col h-[120px]">
                    <CardTitle className="text-xs text-gray-500 mb-1">Invoices</CardTitle>
                    <p className="text-sm">
                        {
                            today.toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })
                        } - {
                            oneMonthAgo.toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })
                        }
                    </p>
                    <Button variant="secondary" className="w-full mt-2"> <ArrowDownToLine className="w-4 h-4" /> Download</Button>
                </Card>
            </div>
        </div>
    );
};

export default DashboardTopRow;
