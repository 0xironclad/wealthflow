import pool from "@/database/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try {
        const query = `SELECT s.name, sh.amount, sh.date FROM savings_history sh JOIN savings s ON sh.saving_id = s.id WHERE s.userid = $1 and sh.type = 'deposit' ORDER BY sh.date DESC`;
        const values = [userId];
        const result = await pool.query(query, values);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const history = result.rows.map((row: any) => ({
            name: row.name,
            amount: row.amount,
            date: new Date(row.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }),
        }));
        return NextResponse.json(history, { status: 200 });
    } catch (error) {
        console.error("Error fetching savings history:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
