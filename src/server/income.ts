"use server";

import pool from "@/database/db";

export const getIncomesById = async (userId: string) => {
    console.log('[getIncomesById] Called with userId:', userId);
    if (!userId) {
        console.error("[getIncomesById] Invalid userId provided");
        return [];
    }

    try {
        const encodedUserId = encodeURIComponent(userId);
        if (!encodedUserId) {
            console.error("Failed to encode userId");
            return [];
        }
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(
            `${baseUrl}/api/income?userId=${encodedUserId}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || `Error fetching incomes: ${response.statusText}`
            );
        }

        if (!result.success) {
            throw new Error(result.message || "Failed to fetch incomes");
        }

        return result.data;
    } catch (error) {
        console.error("Error in getIncomesById:", error);
        return [];
    }
};

export async function createIncome(data: {
    userId: string;
    name: string;
    amount: number;
    date: Date;
    category: string;
    source: string;
    isRecurring: boolean;
    recurringFrequency?: string;
}) {
    try {
        const query = `
      INSERT INTO incomes (
        userId, name, amount, date, category, source, isRecurring, recurringFrequency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
        const values = [
            data.userId,
            data.name,
            data.amount,
            data.date,
            data.category,
            data.source,
            data.isRecurring,
            data.recurringFrequency || null,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating income:", error);
        throw error;
    }
}

export const getTotalIncome = async (userId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const encodedUserId = encodeURIComponent(userId);
        const response = await fetch(
            `${baseUrl}/api/balance?userId=${encodedUserId}`
        );

        if (!response.ok) {
            throw new Error(`Error fetching total income: ${response.statusText}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error in getTotalIncome:", error);
        return 0;
    }
};

export const getMonthlyIncomeTotal = async (userId: string, year?: number, month?: number) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const encodedUserId = encodeURIComponent(userId);

        // If no year/month provided, use current month
        const now = new Date();
        const targetYear = year ?? now.getFullYear();
        const targetMonth = month ?? now.getMonth() + 1; // getMonth() returns 0-11, we need 1-12

        // Calculate start and end dates for the month
        const startOfMonth = new Date(targetYear, targetMonth - 1, 1).toISOString().split('T')[0];
        const endOfMonth = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];

        const response = await fetch(
            `${baseUrl}/api/income?userId=${encodedUserId}&total=true&from=${startOfMonth}&to=${endOfMonth}`
        );

        if (!response.ok) {
            throw new Error(`Error fetching monthly income total: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to fetch monthly income total");
        }

        return result.data;
    } catch (error) {
        console.error("Error in getMonthlyIncomeTotal:", error);
        return {
            totalIncome: 0,
            incomeCount: 0,
            averageIncome: 0,
            dateRange: { from: null, to: null }
        };
    }
};

export const getCurrentMonthIncomeTotal = async (userId: string) => {
    return getMonthlyIncomeTotal(userId);
};
