"use server";

import pool from "@/database/db";

export const getIncomesById = async (userId: string) => {
    console.log('[getIncomesById] Called with userId:', userId);
    if (!userId) {
        console.error("[getIncomesById] Invalid userId provided");
        return [];
    }

    try {
        const query = "SELECT * FROM incomes WHERE userid = $1 ORDER BY date DESC";
        const result = await pool.query(query, [userId]);
        console.log('[getIncomesById] Query result:', result.rows.length, 'rows');
        return result.rows;
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
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const query = `
            SELECT 
                COALESCE(
                    (SELECT SUM(amount) FROM incomes WHERE userid = $1) - 
                    (SELECT SUM(amount) FROM expenses WHERE userid = $1 AND type = 'expense') +
                    (SELECT SUM(amount) FROM expenses WHERE userid = $1 AND type = 'income') -
                    (SELECT SUM(amount) FROM expenses WHERE userid = $1 AND type = 'withdrawal') -
                    (SELECT SUM(amount) FROM savings WHERE userid = $1), 
                    0
                ) as total_balance
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0].total_balance;
    } catch (error) {
        console.error("Error in getTotalIncome:", error);
        return 0;
    }
};

export const getMonthlyIncomeTotal = async (userId: string, year?: number, month?: number) => {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        // If no year/month provided, use current month
        const now = new Date();
        const targetYear = year ?? now.getFullYear();
        const targetMonth = month ?? now.getMonth() + 1; // getMonth() returns 0-11, we need 1-12

        // Calculate start and end dates for the month
        const startOfMonth = new Date(targetYear, targetMonth - 1, 1).toISOString().split('T')[0];
        const endOfMonth = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];

        const query = `
            SELECT 
                COALESCE(SUM(amount), 0) as total_income,
                COUNT(*) as income_count,
                COALESCE(AVG(amount), 0) as average_income
            FROM incomes
            WHERE userid = $1
            AND date >= $2::date
            AND date <= $3::date
        `;
        const result = await pool.query(query, [userId, startOfMonth, endOfMonth]);
        
        return {
            totalIncome: parseFloat(result.rows[0].total_income),
            incomeCount: parseInt(result.rows[0].income_count),
            averageIncome: parseFloat(result.rows[0].average_income),
            dateRange: { from: startOfMonth, to: endOfMonth }
        };
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
