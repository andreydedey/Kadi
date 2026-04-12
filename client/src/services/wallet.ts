import type { Wallet, WalletCategory } from "@/lib/types/wallet"
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

export const getWallet = async (walletId: string): Promise<Wallet> => {
  const { data } = await api.get<Wallet>(`/wallet/${walletId}`)
  return data
}

export const getWalletCategories = async (walletId: string): Promise<WalletCategory[]> => {
  const { data } = await api.get<WalletCategory[]>(`/wallet/${walletId}/categories`)
  return data
}
