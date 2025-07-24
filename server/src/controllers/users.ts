import { Request, Response } from "express";
import pool from "../db";

export const getAllExpenses = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM expenses');
        client.release();
        return result.rows;
    } catch (error) {
        console.error('Error fetching all expenses:', error);
        throw error;
    }
};
