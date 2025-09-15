import { NextResponse } from "next/server";
import pool from "@/database/db";
import { determineStatus } from "@/lib/determine-status";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.id || body.amount === undefined) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: id and amount"
      }, { status: 400 });
    }

    const getCurrentSaving = "SELECT * FROM savings WHERE id = $1";
    const currentResult = await pool.query(getCurrentSaving, [body.id]);

    if (currentResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Saving not found"
      }, { status: 404 });
    }

    const currentAmount = parseFloat(currentResult.rows[0].amount);
    const currentStatus = currentResult.rows[0].status;
    const withdrawAmount = parseFloat(body.amount);

    if (withdrawAmount > currentAmount) {
      return NextResponse.json({
        success: false,
        message: "Insufficient funds"
      }, { status: 400 });
    }

    const newAmount = currentAmount - withdrawAmount;
    const newStatus = determineStatus(
      newAmount,
      currentResult.rows[0].goal,
      currentResult.rows[0].targetDate,
      currentResult.rows[0].createdAt
    );

    if (newStatus !== currentStatus) {
      const updateStatusQuery = "UPDATE savings SET status = $1 WHERE id = $2";
      await pool.query(updateStatusQuery, [newStatus, body.id]);
    }

    const query = "UPDATE savings SET amount = $1 WHERE id = $2 RETURNING *";
    const result = await pool.query(query, [newAmount, body.id]);

    // Update the expenses table with the new transaction
    const newTransactionQuery = "INSERT INTO expenses (userid, name, date, amount, type, paymentmethod, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    await pool.query(newTransactionQuery, [
      currentResult.rows[0].userid,
      `${currentResult.rows[0].name} - Withdrawal`,
      new Date(),
      withdrawAmount,
      "withdrawal",
      "debit",
      "Saving"
    ]);

    // Add to savings_history
    const historyQuery = `
      INSERT INTO savings_history (saving_id, amount, type, date)
      VALUES ($1, $2, $3, NOW() )
      RETURNING *`

      try{
        await pool.query(historyQuery, [body.id, withdrawAmount, 'withdrawal']);
        console.log('Savings history updated successfully')
      } catch (error) {
        console.error('Error inserting into savings_history:', error);
        return NextResponse.json({
          success: false,
          message: "Error adding withdrawal to savings history",
          error: String(error)
        }, { status: 500 });
      }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json({
      success: false,
      message: "Error processing withdrawal",
      error: String(error)
    }, { status: 500 });
  }
}
