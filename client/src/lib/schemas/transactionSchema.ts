import z from "zod"
import { REQUIRED } from "../consts"

export const transactionSchema = z.object({
  amount: z.number({ error: REQUIRED }),
  categoryId: z.number({ error: REQUIRED }),
  description: z.string().optional(),
  eventDate: z.string({ error: REQUIRED }).min(1, REQUIRED),
})

export type TransactionSchema = z.infer<typeof transactionSchema>

export const transferSchema = z.object({
  destinationWalletId: z.string().min(1, REQUIRED),
  amount: z.number({ error: REQUIRED }),
  destinationAmount: z.number({ error: REQUIRED }),
  description: z.string().optional(),
  eventDate: z.string({ error: REQUIRED }).min(1, REQUIRED),
})

export type TransferSchema = z.infer<typeof transferSchema>
