import { z } from "zod";

export const ExpenseSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  date: z.string().datetime(),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  paymentMethod: z.enum(["cash", "credit", "debit"]),
  category: z.enum([
    "Food",
    "Rent",
    "Transport",
    "Entertainment",
    "Health",
    "Utilities",
    "Education",
    "Shopping",
    "Other"
  ])
});

export const UpdateExpenseSchema = ExpenseSchema.partial();
