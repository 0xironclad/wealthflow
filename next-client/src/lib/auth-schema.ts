import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .max(50, {
      message: "Name must not be more than 50 characters",
    }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(50, {
      message: "Password must not be more than 50 characters",
    }),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});
