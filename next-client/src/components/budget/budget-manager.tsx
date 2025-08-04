/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { BudgetRadialChart } from "./budget-radial-chart";
import dynamic from "next/dynamic";
import { Toaster, toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBudgetsById, createBudget, updateBudgetById } from "@/server/budget";
import { Trash, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { deleteBudget } from "@/server/budget";
import { Budget } from "@/lib/types";
import {
    Utensils,
    HousePlus,
    MonitorPlay,
    CarFront,
    HeartPulse,
    Droplets,
    GraduationCap,
    ShoppingCart,
    WalletCards,
    ArrowDownLeft,
    PiggyBank,
    Target,
    Plus,
    Loader2
} from "lucide-react";
import { useUser } from "@/context/UserContext";

const BudgetForm = dynamic(() => import("./budget-form").then(mod => mod.EditBudgetForm), { ssr: false });
const EditBudgetFormComponent = dynamic(() => import("./budget-form").then(mod => mod.EditBudgetForm), { ssr: false });

const getIcon = (category: string) => {
    const iconMap = {
        Food: Utensils,
        Rent: HousePlus,
        Entertainment: MonitorPlay,
        Transport: CarFront,
        Health: HeartPulse,
        Utilities: Droplets,
        Education: GraduationCap,
        Shopping: ShoppingCart,
        Other: WalletCards,
    };
    return iconMap[category as keyof typeof iconMap] || ArrowDownLeft;
};

function BudgetManager() {
    const queryClient = useQueryClient();
    const [selectedBudget, setSelectedBudget] = React.useState<Budget | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const { user } = useUser();

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['budgets'],
        queryFn: () => getBudgetsById(user?.id || ''),
        refetchOnWindowFocus: true,
        select: (data) => data.data.map((budget: {
            id: number;
            user_id: string;
            name: string;
            description: string;
            period_type: string;
            start_date: string;
            end_date: string;
            category: string;
            planned_amount: number;
            spent_amount: number;
            is_rollover: boolean;
        }) => ({
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
        }))
    });

    const createBudgetMutation = useMutation({
        mutationFn: createBudget,
        onMutate: async (newBudget) => {
            await queryClient.cancelQueries({ queryKey: ['budgets'] });

            const previousBudgets = queryClient.getQueryData(['budgets']);

            queryClient.setQueryData(['budgets'], (old: any) => ({
                ...old,
                data: [...old.data, {
                    ...newBudget,
                    id: Date.now(),
                }]
            }));

            return { previousBudgets };
        },
        onError: (err, newBudget, context) => {
            if (context) {
                queryClient.setQueryData(['budgets'], context.previousBudgets);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        }
    });

    const updateBudgetMutation = useMutation({
        mutationFn: ({ id, userId, data }: { id: number; userId: string; data: any }) =>
            updateBudgetById(id, userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            setSelectedBudget(null);
            setIsEditDialogOpen(false);
        },
        onError: () => {
            toast.error("Failed to update budget");
        }
    });

    const deleteBudgetMutation = useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: string }) =>
            deleteBudget(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            toast.success("Budget deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete budget");
        }
    });

    const totalBudget = categories?.reduce((sum: any, budget: { plannedAmount: any; }) => sum + budget.plannedAmount, 0) ?? 0;
    const totalSpent = categories?.reduce((sum: any, budget: { spentAmount: any; }) => sum + budget.spentAmount, 0) ?? 0;

    const handleEdit = (budget: Budget) => {
        setSelectedBudget(budget);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        deleteBudgetMutation.mutate({ id, userId: user?.id || '' });
    };

    const handleUpdate = (updatedBudget: any) => {
        if (!selectedBudget) return;

        updateBudgetMutation.mutate({
            id: selectedBudget.id,
            userId: selectedBudget.userId,
            data: updatedBudget
        });
    };

    const isBudgetEmpty = () => {
        return categories?.length === 0;
    }
    return (
        <div className="space-y-2 w-full max-w-4xl">
            <div className="h-[250px] w-full">
                <BudgetRadialChart totalBudget={totalBudget} totalSpent={totalSpent} />
            </div>

            <div>
                <p className="text-sm text-muted-foreground mb-4">
                    Budget Categories
                </p>
                <div className="flex flex-col space-y-1 h-[350px] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full text-destructive">
                            Error loading budgets
                        </div>
                    ) : !categories || categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 px-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <PiggyBank className="w-12 h-12 text-primary" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center">
                                    <Target className="w-4 h-4 text-chart-2" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold text-foreground">
                                    No budgets yet
                                </h3>
                                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                                    Start taking control of your finances by creating your first budget.
                                    Set spending limits and track your progress.
                                </p>
                            </div>

                            <div className="flex flex-col space-y-3 w-full max-w-xs">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Your First Budget
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle asChild>
                                            <VisuallyHidden>Create New Budget</VisuallyHidden>
                                        </DialogTitle>
                                        <BudgetForm
                                            budget={{
                                                id: 0,
                                                userId: user?.id || '',
                                                name: '',
                                                description: '',
                                                periodType: 'monthly',
                                                startDate: new Date().toISOString(),
                                                endDate: new Date().toISOString(),
                                                category: 'Food',
                                                plannedAmount: 0,
                                                spentAmount: 0,
                                                rollOver: false
                                            }}
                                            onSuccessfulSubmit={(budgetData) => {
                                                createBudgetMutation.mutate(budgetData);
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>

                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <div className="flex -space-x-1">
                                        <div className="w-6 h-6 rounded-full bg-chart-1/20 flex items-center justify-center">
                                            <Utensils className="w-3 h-3 text-chart-1" />
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-chart-2/20 flex items-center justify-center">
                                            <HousePlus className="w-3 h-3 text-chart-2" />
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-chart-3/20 flex items-center justify-center">
                                            <CarFront className="w-3 h-3 text-chart-3" />
                                        </div>
                                    </div>
                                    <span>Track Food, Rent, Transport & more</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        categories.map((category: any, index: number) => {
                            const Icon = getIcon(category.category);
                            const progress = (category.spentAmount / category.plannedAmount) * 100;
                            const isOverBudget = progress > 100;


                            return (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                                >
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Content */}
                                    <div className="relative p-4 space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.category === 'Food' ? 'from-chart-1/20 to-chart-1/30' :
                                                    category.category === 'Rent' ? 'from-chart-2/20 to-chart-2/30' :
                                                        category.category === 'Transport' ? 'from-chart-3/20 to-chart-3/30' :
                                                            category.category === 'Entertainment' ? 'from-chart-4/20 to-chart-4/30' :
                                                                'from-primary/20 to-primary/30'
                                                    } shadow-sm`}>
                                                    <Icon className="h-5 w-5 text-foreground" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-foreground text-lg">
                                                        {category.name}
                                                    </h3>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge
                                                            variant={category.rollOver === "Yes" ? "default" : "secondary"}
                                                            className="text-xs font-medium"
                                                        >
                                                            {category.rollOver === "Yes" ? "Roll Over" : "No Roll Over"}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {category.periodType}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(category)}
                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                                                >
                                                    <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(category.id)}
                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10"
                                                >
                                                    <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Budget Amount Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-end justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                                        Spent
                                                    </p>
                                                    <p className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                                                        ${category.spentAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                                        Budget
                                                    </p>
                                                    <p className="text-lg font-semibold text-muted-foreground">
                                                        ${category.plannedAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress Section */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {Math.round(progress)}%
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ${(category.plannedAmount - category.spentAmount).toLocaleString()} remaining
                                                    </span>
                                                </div>

                                                {/* Custom Progress Bar */}
                                                <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                                                    <div
                                                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-gradient-to-r from-destructive to-destructive/80' :
                                                            progress > 70 ? 'bg-gradient-to-r from-chart-4 to-chart-4/80' :
                                                                'bg-gradient-to-r from-chart-2 to-chart-2/80'
                                                            }`}
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    />
                                                    {isOverBudget && (
                                                        <div className="absolute top-0 right-0 h-full w-1 bg-destructive animate-pulse" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date Range */}
                                        <div className="pt-2 border-t border-border/30">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>
                                                    {new Date(category.startDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <div className="flex-1 mx-2 border-t border-dashed border-muted-foreground/30" />
                                                <span>
                                                    {new Date(category.endDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overflow Indicator */}
                                    {isOverBudget && (
                                        <div className="absolute top-2 right-2 w-3 h-3 bg-destructive rounded-full animate-pulse shadow-lg shadow-destructive/20" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {
                !isBudgetEmpty() && (
                    <div className="flex space-x-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="w-full bg-primary text-primary-foreground">
                                    Add New Budget
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md h-[80vh] overflow-y-auto styled-scrollbar">
                                <DialogTitle asChild>
                                    <VisuallyHidden>Manage Budget</VisuallyHidden>
                                </DialogTitle>
                                <BudgetForm
                                    budget={{
                                        id: 0,
                                        userId: user?.id || '',
                                        name: '',
                                        description: '',
                                        periodType: 'monthly',
                                        startDate: new Date().toISOString(),
                                        endDate: new Date().toISOString(),
                                        category: 'Food',
                                        plannedAmount: 0,
                                        spentAmount: 0,
                                        rollOver: false
                                    }}
                                    onSuccessfulSubmit={(budgetData) => {
                                        createBudgetMutation.mutate(budgetData);
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            }

            {/* Edit Budget Dialog */}
            {selectedBudget && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogTitle asChild>
                            <VisuallyHidden>Edit Budget</VisuallyHidden>
                        </DialogTitle>
                        <EditBudgetFormComponent
                            budget={selectedBudget}
                            onSuccessfulSubmit={handleUpdate}
                        />
                    </DialogContent>
                </Dialog>
            )}

            <Toaster
                position="bottom-right"
                theme="dark"
                richColors
                expand={false}
                duration={2000}
                style={{
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))'
                }}
            />
        </div>
    );
}

export default BudgetManager;
