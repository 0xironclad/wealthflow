import { getAllExpenses } from "../controllers/users";
import express from "express";

const expenseRouter = express.Router();

expenseRouter.get("/", async (req, res) => {
    try {
        const expenses = await getAllExpenses();
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export const router = expenseRouter;
