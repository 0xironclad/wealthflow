import pool from "@/database/db";
import { NextResponse } from "next/server";
import { determineStatus } from "@/lib/determine-status";

export async function POST() {
    try {
        const query = 'SELECT id, amount, goal, targetDate, createdAt FROM savings where status != "completed"'
        const result = await pool.query(query)
        for (const saving of result.rows) {
            const newStatus = determineStatus(saving.amount, saving.goal, saving.targetDate, saving.createdAt)
            if (newStatus !== saving.status) {
                const updateQuery = 'UPDATE savings SET status = $1 WHERE id = $2'
                await pool.query(updateQuery, [newStatus, saving.id])
            }
        }
        return NextResponse.json({
            success: true,
            message: "Status updated successfully"
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error fetching savings",
            error: String(error)
        }, { status: 500 })
    }
}
