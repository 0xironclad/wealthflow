import { z } from "zod";

export const IncomeSchema = z.object({
    userId: z.string(),
    name: z.string().min(1, "Name is required"),
    date: z.string().datetime(),
    amount: z.number().positive("Amount must be positive"),
    category: z.enum(["Salary", "Bonus", "Investment", "Freelance", "Business", "Other"]),
    source: z.enum(["Employer", "Self-Employment", "Investments", "Client", "Family/Friend", "Other"]),
    isRecurring: z.boolean().default(false),
    recurringFrequency: z.string().optional(),
});
export const UpdateIncomeSchema = IncomeSchema.partial();
