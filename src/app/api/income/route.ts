import { NextResponse } from "next/server";
import pool from "@/database/db";
import { IncomeSchema } from "@/lib/schemas/income-schema";

// Get all the incomes from the database
export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const userId = url.searchParams.get('userId')

        if (!userId || userId === 'null' || userId === 'undefined') {
            return NextResponse.json({
                success: false,
                message: "Valid User ID is required"
            }, { status: 400 })
        }

        const query = 'SELECT * FROM incomes WHERE userid = $1'
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
            message: "Error fetching incomes",
            error: String(error)
        }, { status: 500 })
    }
}


// Add a new income to the database
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { error } = IncomeSchema.safeParse(body)
        if (error) {
            return NextResponse.json({
                success: false,
                message: "Invalid income data",
                error
            }, { status: 400 })
        }
        const query = 'INSERT INTO incomes (userid, name, date, amount, category, source, isrecurring, recurringfrequency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
        const result = await pool.query(query, [body.userId, body.name, body.date, body.amount, body.category, body.source, body.isRecurring, body.recurringFrequency])
        return NextResponse.json({
            success: true,
            data: result.rows[0]
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error adding income",
            error
        }, { status: 500 })
    }
}
