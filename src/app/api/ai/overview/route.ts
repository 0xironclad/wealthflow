import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import pool from "@/database/db";
import { generateFinancialOverviewPrompt } from "@/lib/prompts/financial";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User ID is required"
            }, { status: 400 })
        }

        const {rows: savings} = await pool.query('SELECT * FROM savings WHERE userid = $1', [userId]);
        const { rows: expenses } = await pool.query('SELECT * FROM expenses WHERE userid = $1', [userId]);
        const { rows: budgets } = await pool.query('SELECT * FROM budgets WHERE user_id = $1', [userId]);
        const { rows: income } = await pool.query('SELECT * FROM incomes WHERE userid = $1', [userId]);
        const prompt = generateFinancialOverviewPrompt({
            savings,
            expenses,
            budgets,
            income
        });
        const ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return NextResponse.json({
            success: true,
            data: response,
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 })
    }
}
