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
import { DatePeriodSelector } from "@/components/ui/date-period-selector"
import { AlertCircle, Plus } from "lucide-react"
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
                    <DatePeriodSelector />
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
                            <Card className="w-full h-full flex flex-col">
                                {data.hasRadialChart ? (
                                    <CardContent className="flex-1 pb-0 flex items-center justify-center">
                                        <Skeleton className="h-20 w-20 rounded-full" />
                                    </CardContent>
                                ) : (
                                    <>
                                        <CardHeader className="pb-2">
                                            <Skeleton className="h-4 w-24" />
                                        </CardHeader>
                                        <CardContent className="pt-0 flex-1 flex items-start">
                                            <Skeleton className="h-6 w-16" />
                                        </CardContent>
                                    </>
                                )}
                            </Card>
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
                        <div className="p-6 rounded-lg border bg-card">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    ) : (
                        <BudgetAllocation budgets={budgets} />
                    )}
                </div>
                <div className="md:col-span-4">
                    {budgetsLoading ? (
                        <div className="p-6 rounded-lg border bg-card">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    ) : (
                        <SpendTrendLineChart budgets={budgets} period={currentPeriod.type} />
                    )}
                </div>
            </div>

            {/* Third Row - Budget Details Table */}
            <div className="w-full px-4 py-3 flex-1">
                {budgetsLoading ? (
                    <div className="p-6 rounded-lg border bg-card">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </div>
                ) : budgets && budgets.length > 0 ? (
                    <BudgetDetails budgets={budgets} />
                ) : (
                    <div className="p-8 rounded-lg border bg-card text-center">
                        <h3 className="text-lg font-semibold mb-2">No budgets found</h3>
                        <p className="text-muted-foreground mb-4">
                            Create your first budget to start tracking your spending
                        </p>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Budget
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
                )}
            </div>
        </div>
    )
}

export default BudgetManager
