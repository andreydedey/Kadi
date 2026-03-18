import { z } from "zod"

export const createUserSchema = z
  .object({
    name: z.string(),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must contain at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't mactch",
    path: ["confirmPassword"],
  })

export type createUserSchema = z.infer<typeof createUserSchema>
