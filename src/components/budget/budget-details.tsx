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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Budget } from "@/lib/types"
import { EditBudgetForm } from "./budget-form"
import { Edit, Trash2 } from "lucide-react"
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
            <Card className="w-full h-[400px]">
                <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                        <p className="text-lg font-medium mb-2">No budgets found</p>
                        <p className="text-sm">Create your first budget to get started</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full h-[400px]">
            <CardContent>
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
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(budget)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the budget &ldquo;{budget.name}&rdquo;.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(budget)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
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
