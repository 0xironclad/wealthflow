import { NextResponse } from "next/server";
import pool from "@/database/db";
import { ExpenseSchema, UpdateExpenseSchema } from "@/lib/schemas/expense-schema";


const validateId = (id: string | null, name: string) => {
    if (!id) {
        return {
            isValid: false,
            error: {
                success: false,
                message: `${name} must be a positive number`
            }
        };
    }
    return { isValid: true };
};

export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const userId = url.searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User ID is required"
            }, { status: 400 })
        }

        const query = 'SELECT * FROM expenses WHERE userid = $1'

        const result = await pool.query(query, [userId])

        return NextResponse.json(
            {
                success: true,
                data: result.rows,
            },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error fetching expenses",
            error
        }, { status: 500 })
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { error } = ExpenseSchema.safeParse(body)
        if (error) {
            return NextResponse.json({
                success: false,
                message: "Invalid expense data",
                error
            }, { status: 400 })
        }

        // Start a transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert the expense
            const expenseQuery = 'INSERT INTO expenses (userid, name, date, amount, type, paymentmethod, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
            const expenseResult = await client.query(expenseQuery, [
                body.userId,
                body.name,
                body.date,
                body.amount,
                body.type,
                body.paymentMethod,
                body.category
            ])

            // If it's an expense, update the corresponding budget
            if (body.type === "expense") {
                // Find the active budget for this category and user
                const budgetQuery = `
                    SELECT id, spent_amount
                    FROM budgets
                    WHERE user_id = $1
                    AND category = $2
                    AND is_active = true
                    AND start_date <= $3
                    AND end_date >= $3
                    ORDER BY created_at DESC
                    LIMIT 1
                `;
                const budgetResult = await client.query(budgetQuery, [
                    body.userId,
                    body.category,
                    body.date
                ]);

                // If a budget exists, update its spent amount
                if (budgetResult.rows.length > 0) {
                    const budget = budgetResult.rows[0];
                    const updateBudgetQuery = `
                        UPDATE budgets
                        SET spent_amount = spent_amount + $1
                        WHERE id = $2
                        RETURNING *
                    `;
                    await client.query(updateBudgetQuery, [body.amount, budget.id]);
                }
            }

            // Handle income insertion if needed
            if (body.type === "income") {
                try {
                    const incomeQuery = `
                        INSERT INTO incomes (
                            userid,
                            name,
                            date,
                            amount,
                            category,
                            source,
                            isrecurring,
                            recurringfrequency
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        RETURNING *
                    `
                    await client.query(incomeQuery, [
                        body.userId,
                        body.name,
                        body.date,
                        body.amount,
                        body.category,
                        body.paymentMethod,
                        body.isRecurring || false,
                        body.recurringFrequency || null
                    ])
                } catch (incomeError) {
                    console.error('Error inserting income:', incomeError)
                }
            }

            // Commit the transaction
            await client.query('COMMIT');

            return NextResponse.json({
                success: true,
                data: expenseResult.rows[0]
            }, { status: 201 })
        } catch (error) {
            // Rollback the transaction in case of error
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error in POST /api/expense:', error)
        return NextResponse.json({
            success: false,
            message: "Error adding transaction",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { error } = UpdateExpenseSchema.safeParse(body)
        if (error) {
            return NextResponse.json({
                success: false,
                message: "Invalid expense data", error
            }, { status: 400 })
        }
        const query = 'UPDATE expenses SET name = $1, date = $2, amount = $3, type = $4, paymentmethod = $5, category = $6 WHERE id = $7 RETURNING *'
        const result = await pool.query(query, [body.name, body.date, body.amount, body.type, body.paymentMethod, body.category, body.id])
        return NextResponse.json({
            success: true,
            data: result.rows[0]
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error updating expense",
            error
        }, { status: 500 })
    }
}


// Delete an expense from the database
export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get('id')
        const userId = url.searchParams.get('userId')

        const expenseValidation = validateId(id, "Expense ID")
        if (!expenseValidation.isValid) {
            return NextResponse.json(expenseValidation.error, { status: 400 })
        }
        const userValidation = validateId(userId, "User ID")
        if (!userValidation.isValid) {
            return NextResponse.json(userValidation.error, { status: 400 })
        }

        const queryCheck = 'SELECT * FROM expenses WHERE id = $1 AND userid = $2'
        const resultCheck = await pool.query(queryCheck, [id, userId])
        if (resultCheck.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Expense not found"
            }, { status: 404 })
        }

        const query = 'DELETE FROM expenses WHERE id = $1 AND userid = $2 RETURNING *'
        const result = await pool.query(query, [id, userId])
        return NextResponse.json({
            success: true,
            message: "Expense deleted successfully",
            data: result.rows[0]
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error deleting expense",
            error
        }, { status: 500 })
    }
}
