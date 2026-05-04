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

export interface CreateWalletCategoryRequest {
  categoryId: number
  spendingLimit: number
}

export const deleteWalletCategory = async (walletId: string, categoryId: number): Promise<void> => {
  await api.delete(`/wallet/${walletId}/categories/${categoryId}`)
}

export const createWalletCategory = async (
  walletId: string,
  body: CreateWalletCategoryRequest,
): Promise<WalletCategory> => {
  const { data } = await api.post<WalletCategory>(`/wallet/${walletId}/categories`, body)
  return data
}

export interface UpdateWalletRequest {
  name: string
  salaryDay?: number
  expectedMonthlyIncome?: number
}

export const updateWallet = async (walletId: string, body: UpdateWalletRequest): Promise<Wallet> => {
  const { data } = await api.put<Wallet>(`/wallet/${walletId}`, body)
  return data
}

export const archiveWallet = async (walletId: string): Promise<void> => {
  await api.patch(`/wallet/${walletId}/archive`)
}

export const deleteWallet = async (walletId: string): Promise<void> => {
  await api.delete(`/wallet/${walletId}`)
}

export const updateWalletCategory = async (
  walletId: string,
  categoryId: number,
  body: CreateWalletCategoryRequest,
): Promise<WalletCategory> => {
  const { data } = await api.put<WalletCategory>(`/wallet/${walletId}/categories/${categoryId}`, body)
  return data
}
