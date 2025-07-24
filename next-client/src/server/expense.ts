import { InvoiceType } from "@/lib/types";

export const getExpensesById = async (userId: string) => {
    try {
        const response = await fetch(`/api/expense?userId=${userId}`);
        if (!response.ok) {
            throw new Error(`Error fetching expenses: ${response.statusText}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createExpense = async (expenseData: Omit<InvoiceType, "id">) => {
    const response = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
    });
    if (!response.ok) {
        throw new Error(`Error adding expense: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
        throw new Error(`Error adding expense: ${result.message}`);
    }
    return result.data;
};

export const updateExpenseById = async (expenseId: number, updatedData: Partial<InvoiceType>) => {
    const response = await fetch(`/api/expense`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: expenseId, ...updatedData }),
    });
    if (!response.ok) {
        throw new Error(`Error updating expense: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
        throw new Error(`Error updating expense: ${result.message}`);
    }
    return result.data;
};

export const deleteExpenseById = async (expenseId: number, userId: string) => {
    const response = await fetch(`/api/expense?id=${expenseId}&userId=${userId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`Error deleting expense: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
        throw new Error(`Error deleting expense: ${result.message}`);
    }
    return result.data;
};
