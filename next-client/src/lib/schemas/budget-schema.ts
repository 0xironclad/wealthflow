import { z } from "zod";

export const BudgetSchema = z.object({
    userId: z.string(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    periodType: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly", "custom"]).default("monthly"),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
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
    ]).default("Food"),
    plannedAmount: z.coerce.number().min(0).default(0),
    spentAmount: z.coerce.number().min(0).default(0),
    rollOver: z.boolean().default(false),
});
export const UpdateBudgetSchema = BudgetSchema.partial();
