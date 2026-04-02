import z from "zod"
import { REQUIRED } from "../consts"

export const createWalletSchema = z.object({
  name: z.string().min(1, REQUIRED),
  balance: z.number({ error: REQUIRED }),
  currency: z.string({ error: REQUIRED }).min(1, REQUIRED),
})

export type CreateWalletSchema = z.infer<typeof createWalletSchema>
