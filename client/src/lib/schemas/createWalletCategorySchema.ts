import z from "zod"
import { REQUIRED } from "../consts"

export const createWalletCategorySchema = z.object({
  categoryId: z.number({ error: REQUIRED }),
  spendingLimit: z.number({ error: REQUIRED }),
})

export type CreateWalletCategorySchema = z.infer<typeof createWalletCategorySchema>
