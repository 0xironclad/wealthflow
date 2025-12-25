"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "../ui/card"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Budget } from "@/lib/types"
import { EditBudgetForm } from "./budget-form"
import { Edit, Trash2, MoreVertical, ClipboardList } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"

interface BudgetDetailsProps {
    budgets?: Budget[];
}

function BudgetDetails({ budgets = [] }: BudgetDetailsProps) {
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const { toast } = useToast()
    const queryClient = useQueryClient()

    // Handle successful budget update
    const handleUpdateSuccess = (budgetData: Budget) => {
        setIsEditDialogOpen(false)
        setEditingBudget(null)

        toast({
            title: "Budget updated successfully",
            description: `Budget "${budgetData?.name || 'Budget'}" has been updated.`,
            duration: 5000,
        })

        // Invalidate and refetch budget queries
        queryClient.invalidateQueries({ queryKey: ["budgets"] })
        queryClient.invalidateQueries({ queryKey: ["budgetTotal"] })
    }

    // Handle budget deletion
    const handleDelete = async (budget: Budget) => {
        try {
            const response = await fetch(`/api/budget?id=${budget.id}&userId=${budget.userId}`, {
                method: 'DELETE',
            })

            const result = await response.json()

            if (result.success) {
                toast({
                    title: "Budget deleted successfully",
                    description: `Budget "${budget.name}" has been deleted.`,
                    duration: 5000,
                })

                // Invalidate and refetch budget queries
                queryClient.invalidateQueries({ queryKey: ["budgets"] })
                queryClient.invalidateQueries({ queryKey: ["budgetTotal"] })
            } else {
                throw new Error(result.message || 'Failed to delete budget')
            }
        } catch (error) {
            toast({
                title: "Error deleting budget",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                variant: "destructive",
                duration: 5000,
            })
        }
    }

    // Handle edit button click
    const handleEdit = (budget: Budget) => {
        setEditingBudget(budget)
        setIsEditDialogOpen(true)
    }

    if (!budgets || budgets.length === 0) {
        return (
            <Card className="w-full h-[400px] relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
                    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-muted/20 blur-3xl" />
                </div>

                <CardContent className="flex items-center justify-center h-full relative z-10">
                    <div className="text-center max-w-sm">
                        {/* Illustrated empty state */}
                        <div className="relative mx-auto mb-6 w-20 h-20">
                            {/* Background shape */}
                            <div className="absolute inset-0 rounded-2xl bg-secondary/60 rotate-6" />
                            <div className="absolute inset-0 rounded-2xl bg-secondary/80 -rotate-3" />
                            {/* Main icon container */}
                            <div className="absolute inset-0 rounded-2xl bg-card border border-border/50 flex items-center justify-center shadow-sm">
                                <ClipboardList className="h-8 w-8 text-muted-foreground/70" />
                            </div>
                            {/* Decorative badge */}
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">0</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            No Budgets Yet
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-1">
                            Start tracking your spending by creating your first budget.
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Set spending limits for different categories to stay on track
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full h-full">
            <CardContent className="h-full overflow-auto">
                <Table>
                    <TableCaption>A list of your current budgets.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold text-base">Budget Name</TableHead>
                            <TableHead className="font-semibold text-base">Category</TableHead>
                            <TableHead className="font-semibold text-base">Period</TableHead>
                            <TableHead className="font-semibold text-base text-right">Planned</TableHead>
                            <TableHead className="font-semibold text-base text-right">Spent</TableHead>
                            <TableHead className="font-semibold text-base text-right">Remaining</TableHead>
                            <TableHead className="font-semibold text-base text-right">Progress</TableHead>
                            <TableHead className="font-semibold text-base text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-y-auto styled-scrollbar">
                        {budgets.map((budget) => {
                            const remaining = budget.plannedAmount - budget.spentAmount
                            const progress = Math.round((budget.spentAmount / budget.plannedAmount) * 100)
                            const isOverBudget = budget.spentAmount > budget.plannedAmount

                            return (
                                <TableRow key={budget.id}>
                                    <TableCell className="font-medium">{budget.name}</TableCell>
                                    <TableCell>{budget.category}</TableCell>
                                    <TableCell className="capitalize">{budget.periodType}</TableCell>
                                    <TableCell className="text-right">${budget.plannedAmount.toLocaleString()}</TableCell>
                                    <TableCell className={`text-right ${isOverBudget ? 'text-red-600 font-medium' : ''}`}>
                                        ${budget.spentAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className={`text-right ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ${remaining.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`${isOverBudget ? 'text-red-600' : progress > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {progress}%
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-1" align="end">
                                                <div className="flex flex-col">
                                                    <Button
                                                        variant="ghost"
                                                        className="justify-start h-8 px-2"
                                                        onClick={() => handleEdit(budget)}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="justify-start h-8 px-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => {
                                                            const confirmed = window.confirm(`Are you sure you want to delete the budget "${budget.name}"? This action cannot be undone.`);
                                                            if (confirmed) {
                                                                handleDelete(budget);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Edit Budget Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Budget</DialogTitle>
                    </DialogHeader>
                    {editingBudget && (
                        <EditBudgetForm
                            budget={editingBudget}
                            onSuccessfulSubmit={handleUpdateSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default BudgetDetails
