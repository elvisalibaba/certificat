import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2).max(160),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});
