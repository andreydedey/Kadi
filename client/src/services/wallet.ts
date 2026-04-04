import type { Wallet } from "@/lib/types/wallet"
import { api } from "./api"

export interface WalletPage {
  content: Wallet[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const getWallets = async (): Promise<WalletPage> => {
  const { data } = await api.get<WalletPage>("/wallet/list")
  return data
}
