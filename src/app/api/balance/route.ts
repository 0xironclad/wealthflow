import { NextResponse } from "next/server";
import pool from "@/database/db";

// Total balance = incomes - expenses + withdrawals
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }
    const query = `SELECT SUM(amount) AS total_income FROM incomes WHERE userid = $1`;
    const incomeResult = await pool.query(query, [userId]);
    const totalIncome = parseFloat(incomeResult.rows[0].total_income || 0);
    console.log(`Total income for user ${userId}: ${totalIncome}`);

    const expenseQuery = `SELECT SUM(amount) AS total_expense FROM expenses WHERE userid = $1 and (type = 'expense' OR type = 'saving')`;
    const expenseResult = await pool.query(expenseQuery, [userId]);
    const totalExpense = parseFloat(expenseResult.rows[0].total_expense || 0);
    console.log(`Total expense for user ${userId}: ${totalExpense}`);

    const withdrawalQuery = `SELECT SUM(amount) AS total_withdrawal FROM expenses WHERE userid = $1 and type = 'withdrawal'`;
    const withdrawalResult = await pool.query(withdrawalQuery, [userId]);
    const totalWithdrawal = parseFloat(withdrawalResult.rows[0].total_withdrawal || 0);
    console.log(`Total withdrawal for user ${userId}: ${totalWithdrawal}`);


    const totalBalance = Number(totalIncome) - Number(totalExpense) + Number(totalWithdrawal);

    return NextResponse.json(
      {
        success: true,
        data: Number(totalBalance.toFixed(2)),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching balance",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
