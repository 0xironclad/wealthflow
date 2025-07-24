import { Request, Response } from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "../../db";
import { querySavings, queryExpenses } from "../../db/queries/queries";

dotenv.config();

export const getInsightsSavings = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const client = await pool.connect();
    const resultSavings = await client.query(querySavings, [userId]);
    const resultExpenses = await client.query(queryExpenses, [userId]);

    client.release();
    const savings = resultSavings.rows;
    const expenses = resultExpenses.rows;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not configured");
    }
    const generativeAI = new GoogleGenerativeAI(apiKey);
    const model = generativeAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const prompt = `
You are an AI financial advisor analyzing the following financial data for a user:
Savings Goals: ${JSON.stringify(savings)}
Expenses: ${JSON.stringify(expenses)}

Based on this data, provide EXACTLY 4 specific, actionable insights focusing on:
1. Which expense category shows the highest potential for reduction
2. A specific amount the user could save monthly by adjusting specific expenses
3. How many months faster they could reach their primary goal with these adjustments
4. One low-effort behavioral change that could significantly impact their savings rate

Format each insight as a brief, actionable bullet point starting with an action verb. Address the user using second person. For example, "Reduce your monthly food expenses by $50. Return the insights in a comma separated array of objects. Each object should have a short title based on the insight. So, something like this: [{"title": "Insight 1", "description": "Insight 1"}, {"title": "Insight 2", "description": "Insight 2"}, {"title": "Insight 3", "description": "Insight 3"}, {"title": "Insight 4", "description": "Insight 4"}]"
`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    res.json({
      success: true,
      message: text,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
