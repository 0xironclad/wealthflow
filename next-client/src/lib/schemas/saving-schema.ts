import { z } from "zod";

export const SavingSchema = z.object({
    userId: z.string(),
    name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
    amount: z.coerce.number().min(0, "Amount cannot be negative"),
    goal: z.coerce.number().min(0, "Goal cannot be negative").nullable(),
    status: z.enum(["active", "completed", "atRisk"]),
    description: z.string().nullable(),
    targetDate: z.string().datetime().nullable(),
    createdAt: z.string().datetime().optional(),
});

export const UpdateSavingSchema = SavingSchema.partial();

export const CreateSavingSchema = SavingSchema.omit({
    createdAt: true
}).extend({
    userId: z.string(),
});
