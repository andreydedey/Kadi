import { z } from "zod"

const REQUIRED = "Required"

const createUserSchema = z
  .object({
    name: z.string().min(1, REQUIRED),
    email: z.string().min(1, REQUIRED).check(z.email("Invalid email")),
    password: z.string().min(1, REQUIRED).min(6, "Password must contain at least 6 characters"),
    confirmPassword: z.string().min(1, REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export { createUserSchema }

export type CreateUserSchema = z.infer<typeof createUserSchema>
