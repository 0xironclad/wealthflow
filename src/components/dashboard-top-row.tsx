"use client";
import {
    Card,
} from "@/components/ui/card"
import { TrendingUp, TrendingDown, CreditCard, PiggyBank, DollarSign, Wallet } from "lucide-react"
import { getIncomesById } from "@/server/income";
import { getExpensesById } from "@/server/expense";
import { useQuery } from "@tanstack/react-query";
import { InvoiceType, IncomeType, SavingsType } from "@/lib/types";
import { getSavings } from "@/server/saving";
// import dynamic from "next/dynamic";
import { getBudgetsById } from "@/server/budget";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";

interface FinancialMetricCardProps {
    label: string;
    value: number | string;
    percentageChange: number;
    isPositive?: boolean;
    previousValue?: number;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
}

const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({
    label,
    value,
    percentageChange,
    isPositive = true,
    previousValue,
    icon: Icon,
    gradient
}) => {
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
            <div className="p-4 flex flex-col h-full justify-between">
                {/* Header with icon */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 bg-gradient-to-r ${gradient} rounded-lg`}>
                            <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <TrendIcon className={`w-3 h-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{percentageChange}%
                        </span>
                    </div>
                </div>

                {/* Main value */}
                <div className="mb-2">
                    <div className="text-2xl font-bold text-foreground leading-none">
                        {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
                    </div>
                </div>

                {/* Comparison */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>vs last month</span>
                    {previousValue && (
                        <span className="bg-muted px-2 py-1 rounded-full">
                            ${previousValue.toLocaleString()}
                        </span>
                    )}
                </div>
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
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 h-full">
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

    // Current month calculations
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

    // Previous month calculations for comparison
    const expensesLastMonth = expenses?.filter((expense: InvoiceType) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === oneMonthAgo.getMonth() &&
            expenseDate.getFullYear() === oneMonthAgo.getFullYear() && expense.type === 'expense';
    }).reduce((sum: number, expense: InvoiceType) => sum + Number(expense.amount), 0) ?? 0;

    const totalIncomeLastMonth = incomes
        ?.filter((income: IncomeType) => {
            const incomeDate = new Date(income.date);
            return incomeDate.getMonth() === oneMonthAgo.getMonth() &&
                incomeDate.getFullYear() === oneMonthAgo.getFullYear();
        })
        .reduce((sum: number, income: IncomeType) => {
            const amount = typeof income.amount === 'string'
                ? parseFloat(income.amount)
                : Number(income.amount);
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0) ?? 0;

    // Calculate percentage changes
    const incomeChange = totalIncomeLastMonth > 0
        ? Math.round(((totalIncomeThisMonth - totalIncomeLastMonth) / totalIncomeLastMonth) * 100)
        : 0;

    const expenseChange = expensesLastMonth > 0
        ? Math.round(((expensesThisMonth - expensesLastMonth) / expensesLastMonth) * 100)
        : 0;

    // budgets
    const totalBudget = categories?.reduce((sum: number, budget: { plannedAmount: number; }) => sum + budget.plannedAmount, 0) ?? 0;
    const totalSpent = categories?.reduce((sum: number, budget: { spentAmount: number; }) => sum + budget.spentAmount, 0) ?? 0;
    const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;


    return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 h-full">
            <div className="col-span-1">
                <FinancialMetricCard
                    label="Income"
                    value={totalIncomeThisMonth}
                    percentageChange={incomeChange}
                    isPositive={incomeChange >= 0}
                    previousValue={totalIncomeLastMonth}
                    icon={DollarSign}
                    gradient="from-emerald-500 to-teal-600"
                />
            </div>
            <div className="col-span-1">
                <FinancialMetricCard
                    label="Expenses"
                    value={Number(expensesThisMonth)}
                    percentageChange={Math.abs(expenseChange)}
                    isPositive={expenseChange <= 0} // Lower expenses are positive
                    previousValue={expensesLastMonth}
                    icon={CreditCard}
                    gradient="from-rose-500 to-pink-600"
                />
            </div>
            <div className="col-span-1">
                <FinancialMetricCard
                    label="Net Savings"
                    value={Number(netSavings)}
                    percentageChange={15} // You can calculate this based on savings history
                    isPositive={true}
                    icon={PiggyBank}
                    gradient="from-blue-500 to-cyan-600"
                />
            </div>
            <div className="col-span-3 md:col-span-1">
                <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                    <div className="p-4 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                                <Wallet className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Budget Progress</span>
                        </div>

                        {/* Progress circle and details */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full border-4 border-muted flex items-center justify-center">
                                    <span className="text-sm font-bold text-foreground">
                                        {isLoading ? '...' : `${percentUsed}%`}
                                    </span>
                                </div>
                                <svg className="absolute top-0 left-0 w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="none"
                                        className={`transition-all duration-500 ${percentUsed > 90 ? 'text-red-500' :
                                            percentUsed > 70 ? 'text-yellow-500' : 'text-green-500'
                                            }`}
                                        strokeDasharray={`${(percentUsed / 100) * 150.8} 150.8`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground mb-1">Spent / Budget</div>
                                <div className="text-sm font-semibold text-foreground">
                                    ${totalSpent.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    / ${totalBudget.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Action button */}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardTopRow;
