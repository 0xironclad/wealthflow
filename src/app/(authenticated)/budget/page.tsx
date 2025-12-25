"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import GenericCard from "@/components/budget/cards"
import { BudgetAllocation } from "@/components/budget/budget-allocation"
import { SpendTrendLineChart } from "@/components/budget/spend-trend-line-chart"
import BudgetDetails from "@/components/budget/budget-details"
import { useBudgets, useBudgetTotal } from "@/lib/queries"
import { useUser } from "@/context/UserContext"
import { useDatePeriod } from "@/hooks/useDatePeriod"
import { AlertCircle, Plus, Sparkles } from "lucide-react"
import { EditBudgetForm } from "@/components/budget/budget-form"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { Budget } from "@/lib/types"

function BudgetManager() {
    const { user } = useUser()
    const { currentPeriod } = useDatePeriod()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()
    const queryClient = useQueryClient()

    // Handle successful budget creation
    const handleBudgetSuccess = (budgetData: Budget) => {
        setIsDialogOpen(false)
        toast({
            title: "Budget created successfully",
            description: `Budget "${budgetData?.name || 'New Budget'}" has been created.`,
            duration: 5000,
        })

        // Invalidate and refetch budget queries to show new data
        queryClient.invalidateQueries({ queryKey: ["budgets"] })
        queryClient.invalidateQueries({ queryKey: ["budgetTotal"] })
        queryClient.invalidateQueries({ queryKey: ["expenses"] })
    }

    const { data: budgets, isLoading: budgetsLoading, error: budgetsError } = useBudgets(
        user?.id || "",
        currentPeriod.from,
        currentPeriod.to
    )
    const { data: budgetTotal, isLoading: totalLoading, error: totalError } = useBudgetTotal(
        user?.id || "",
        currentPeriod.from,
        currentPeriod.to
    )

    if (!user) return null

    const progressPercentage = budgetTotal?.totalPlanned
        ? Math.round((budgetTotal.totalSpent / budgetTotal.totalPlanned) * 100)
        : 0

    // Determine remaining budget color
    const remainingColor = budgetTotal?.remaining && budgetTotal.remaining >= 0
        ? "text-green-500"
        : "text-red-500"

    const budgetData = [
        {
            title: "Total Budget",
            number: budgetTotal?.totalPlanned || 0,
            isLoading: totalLoading
        },
        {
            title: "Total Spent",
            number: budgetTotal?.totalSpent || 0,
            isLoading: totalLoading
        },
        {
            title: "Remaining Budget",
            number: budgetTotal?.remaining || 0,
            style: remainingColor,
            isLoading: totalLoading
        },
        {
            title: "Budget Progress",
            number: budgetTotal?.budgetCount || 0,
            style: progressPercentage > 80 ? "text-red-500" : "text-green-500",
            hasRadialChart: true,
            progress: progressPercentage,
            isLoading: totalLoading
        },
    ]

    // Show error state
    if (budgetsError || totalError) {
        return (
            <div className="h-screen w-full flex flex-col">
                <div className="flex-shrink-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Budgets</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" className="text-lg">
                                <Plus className="w-4 h-4 mr-2" />
                                New Budget
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Budget</DialogTitle>
                            </DialogHeader>
                            {user && (
                                <EditBudgetForm
                                    budget={{
                                        id: 0, // 0 indicates new budget creation
                                        userId: user.id,
                                        name: "",
                                        description: "",
                                        periodType: "monthly",
                                        startDate: new Date().toISOString(),
                                        endDate: new Date().toISOString(),
                                        category: "Food",
                                        plannedAmount: 0,
                                        spentAmount: 0,
                                        rollOver: false,
                                    }}
                                    onSuccessfulSubmit={handleBudgetSuccess}
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="px-4 py-8">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {budgetsError?.message || totalError?.message || "Failed to load budget data"}
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full flex flex-col">
            <div className="flex-shrink-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Budgets</h1>
                <div className="flex items-center gap-3">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" className="text-lg">
                                <Plus className="w-4 h-4 mr-2" />
                                New Budget
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Budget</DialogTitle>
                            </DialogHeader>
                            {user && (
                                <EditBudgetForm
                                    budget={{
                                        id: 0, // 0 indicates new budget creation
                                        userId: user.id,
                                        name: "",
                                        description: "",
                                        periodType: "monthly",
                                        startDate: new Date().toISOString(),
                                        endDate: new Date().toISOString(),
                                        category: "Food",
                                        plannedAmount: 0,
                                        spentAmount: 0,
                                        rollOver: false,
                                    }}
                                    onSuccessfulSubmit={handleBudgetSuccess}
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* First Row - Budget Summary Cards */}
            <div className="px-4 py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {budgetData.map((data) => (
                    <div key={data.title} className="h-[180px]">
                        {data.isLoading ? (
                            data.hasRadialChart ? (
                                <Card className="flex flex-col h-full">
                                    <CardContent className="flex-1 pb-0 flex items-center justify-center">
                                        <div className="relative">
                                            <Skeleton className="h-[120px] w-[120px] rounded-full" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Skeleton className="h-8 w-12" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="w-full h-full flex flex-col relative overflow-hidden">
                                    <CardContent className="p-5 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-8 w-8 rounded-lg" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <Skeleton className="h-9 w-32" />
                                        </div>
                                        <Skeleton className="h-1 w-16 rounded-full mt-4" />
                                    </CardContent>
                                </Card>
                            )
                        ) : (
                            <div className="h-full">
                                <GenericCard
                                    title={data.title}
                                    number={data.number}
                                    style={data.style}
                                    hasRadialChart={data.hasRadialChart}
                                    progress={data.progress}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Second Row - Charts */}
            <div className="w-full px-4 py-3 grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-8">
                    {budgetsLoading ? (
                        <Card className="flex flex-col h-[400px]">
                            <CardContent className="flex gap-4 h-full p-6">
                                {/* Pie chart skeleton */}
                                <div className="mx-auto aspect-square max-h-[350px] flex-shrink-0 flex items-center justify-center">
                                    <div className="relative">
                                        <Skeleton className="h-[200px] w-[200px] rounded-full" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <Skeleton className="h-8 w-20 mb-1" />
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                    </div>
                                </div>
                                {/* Progress bars skeleton */}
                                <div className="flex flex-col flex-1 min-h-0 space-y-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between">
                                                <Skeleton className="h-3 w-20" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                            <Skeleton className="h-2 w-full rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <BudgetAllocation budgets={budgets} />
                    )}
                </div>
                <div className="md:col-span-4">
                    {budgetsLoading ? (
                        <Card className="h-[400px]">
                            <CardHeader>
                                <Skeleton className="h-6 w-48" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full flex flex-col">
                                    {/* Line chart skeleton */}
                                    <div className="flex-1 relative">
                                        {/* Grid lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between">
                                            {[...Array(5)].map((_, i) => (
                                                <Skeleton key={i} className="h-px w-full opacity-30" />
                                            ))}
                                        </div>
                                        {/* Chart line representation */}
                                        <div className="absolute bottom-8 left-0 right-0 h-32">
                                            <Skeleton className="h-full w-full rounded-lg opacity-50" />
                                        </div>
                                    </div>
                                    {/* X-axis labels */}
                                    <div className="flex justify-between mt-2">
                                        {[...Array(6)].map((_, i) => (
                                            <Skeleton key={i} className="h-3 w-8" />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <SpendTrendLineChart budgets={budgets} period={currentPeriod.type} />
                    )}
                </div>
            </div>

            {/* Third Row - Budget Details Table */}
            <div className="w-full px-4 py-3 flex-1">
                {budgetsLoading ? (
                    <Card className="w-full h-[400px]">
                        <CardContent>
                            {/* Table skeleton */}
                            <div className="w-full">
                                {/* Table header */}
                                <div className="border-b">
                                    <div className="flex py-3 gap-4">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20 ml-auto" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                                {/* Table rows */}
                                <div className="space-y-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center py-4 gap-4 border-b border-border/50">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-16 ml-auto" />
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-12" />
                                            <Skeleton className="h-8 w-8 rounded" />
                                        </div>
                                    ))}
                                </div>
                                {/* Table caption */}
                                <div className="flex justify-center py-4">
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : budgets && budgets.length > 0 ? (
                    <BudgetDetails budgets={budgets} />
                ) : (
                    <div className="relative rounded-xl border border-border/50 bg-card text-center h-full flex items-center justify-center flex-col overflow-hidden">
                        {/* Decorative background */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-muted/30 blur-3xl" />
                        </div>

                        <div className="relative z-10 max-w-md px-8 py-12">
                            {/* Illustrated icon */}
                            <div className="relative mx-auto mb-8 w-24 h-24">
                                <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                                <div className="absolute inset-2 rounded-full bg-secondary/80 flex items-center justify-center">
                                    <Sparkles className="h-10 w-10 text-primary/70" />
                                </div>
                                {/* Decorative orbits */}
                                <div className="absolute inset-0 rounded-full border border-dashed border-border/40 animate-[spin_15s_linear_infinite]" />
                                <div className="absolute -inset-3 rounded-full border border-dashed border-border/20 animate-[spin_20s_linear_infinite_reverse]" />
                            </div>

                            <h3 className="text-xl font-semibold text-foreground mb-3">
                                Start Your Budget Journey
                            </h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Take control of your finances by creating your first budget. Track spending, set goals, and build better money habits.
                            </p>

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="default" size="lg" className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Create Your First Budget
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create New Budget</DialogTitle>
                                    </DialogHeader>
                                    {user && (
                                        <EditBudgetForm
                                            budget={{
                                                id: 0,
                                                userId: user.id,
                                                name: "",
                                                description: "",
                                                periodType: "monthly",
                                                startDate: new Date().toISOString(),
                                                endDate: new Date().toISOString(),
                                                category: "Food",
                                                plannedAmount: 0,
                                                spentAmount: 0,
                                                rollOver: false,
                                            }}
                                            onSuccessfulSubmit={handleBudgetSuccess}
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BudgetManager
