import z from "zod"
import { REQUIRED } from "../consts"

export const walletCategorySchema = z.object({
  categoryId: z.number({ error: REQUIRED }),
  spendingLimit: z.number({ error: REQUIRED }),
})

export type WalletCategorySchema = z.infer<typeof walletCategorySchema>
