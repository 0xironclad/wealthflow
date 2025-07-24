import { NextResponse } from "next/server";
import pool from "@/database/db";
import { BudgetSchema, UpdateBudgetSchema } from "@/lib/schemas/budget-schema";

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
        const query = 'SELECT * FROM budgets WHERE user_id = $1'
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
            message: "Error fetching budgets",
            error: String(error)
        }, { status: 500 })
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { error } = BudgetSchema.safeParse(body)
        if (error) {
            return NextResponse.json({
                success: false,
                message: "Invalid budget data",
                error
            }, { status: 400 })
        }
        const query = 'INSERT INTO budgets (user_id, name, description, period_type, start_date, end_date, category, planned_amount, spent_amount, is_rollover) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
        const result = await pool.query(query, [
            body.userId,
            body.name,
            body.description,
            body.periodType,
            body.startDate,
            body.endDate,
            body.category,
            body.plannedAmount,
            body.spentAmount, 
            body.rollOver
        ])

        return NextResponse.json({
            success: true,
            message: "Budget created successfully",
            data: result.rows[0]
        })
    } catch (error) {
        console.error('Error creating budget:', error)
        return NextResponse.json({
            success: false,
            message: "Failed to create budget",
            error
        }, { status: 500 })
    }
}
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const url = new URL(request.url)
        const userId = url.searchParams.get('userId')
        const { error } = UpdateBudgetSchema.safeParse(body)
        if (error) {
            return NextResponse.json({
                success: false,
                message: "Invalid budget data",
                error
            }, { status: 400 })
        }
        const query = 'UPDATE budgets SET name = $1, description = $2, period_type = $3, start_date = $4, end_date = $5, category = $6, planned_amount = $7, spent_amount = $8, is_rollover = $9 WHERE id = $10 AND user_id = $11 RETURNING *'
        const result = await pool.query(query, [body.name, body.description, body.periodType, body.startDate, body.endDate, body.category, body.plannedAmount, body.spentAmount, body.rollover, body.id, userId])
        return NextResponse.json({
            success: true,
            data: result.rows[0]
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error updating budget",
            error: String(error)
        }, { status: 500 })
    }
}


export async function DELETE(request: Request) {
    try{
        const url = new URL(request.url)
        const id = url.searchParams.get('id')
        const userId = url.searchParams.get('userId')
        const query = "delete from budgets where id = $1 and user_id = $2 returning *"
        const result = await pool.query(query, [id, userId])
        return NextResponse.json({
            success: true,
            data: result.rows[0]
        }, { status: 200 })

    } catch(error){
        return NextResponse.json({
            success: false,
            message: "Error deleting budget",
            error: String(error)
        }, { status: 500 })
    }
}
