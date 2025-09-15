import { Budget } from "@/lib/types";

export const getBudgetsById = async (userId: string) => {
    try {
        const response = await fetch(`/api/budget?userId=${userId}`);
        if (!response.ok) {
            return {
                success: false,
                message: `Error fetching budgets: ${response.statusText}`
            }
        }
        const result = await response.json();
        return { success: true, data: result.data }
    } catch (error) {
        console.error("Error in getBudgetsById:", error);
        return { success: false, message: "Error in getBudgetsById" }
    }
}


export const createBudget = async (budgetData: Omit<Budget, "id">) => {
    const response = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetData),
    });
    if (!response.ok) {
        return {
            success: false,
            message: `Error adding budget: ${response.statusText}`
        }
    }
    const result = await response.json();
    if (!result.success) {
        return { success: false, message: `Error adding budget at createBudget: ${result.message}` }
    }
    return { success: true, data: result.data }
}

export const updateBudgetById = async (budgetId: number, userId: string, budgetData: Partial<Budget>) => {
    try {
        const response = await fetch(`/api/budget?userId=${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...budgetData, id: budgetId }),
        });

        if (!response.ok) {
            return {
                success: false,
                message: `Error updating budget: ${response.statusText}`
            }
        }

        const result = await response.json();
        if (!result.success) {
            return {
                success: false,
                message: `Error updating budget: ${result.message}`
            }
        }

        return { success: true, data: result.data }
    } catch (error) {
        console.error("Error in updateBudgetById:", error);
        return {
            success: false,
            message: `Error updating budget: ${error instanceof Error ? error.message : String(error)}`
        }
    }
}

export const deleteBudget = async (budgetId: number, userId: string) => {
    const response = await fetch(`/api/budget?id=${budgetId}&userId=${userId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        return {
            success: false,
            message: `Error deleting budget: ${response.statusText}`
        }
    }
    const result = await response.json();
    if (!result.success) {
        return { success: false, message: `Error deleting budget at deleteBudget: ${result.message}` }
    }
    return { success: true, data: result.data }
}
