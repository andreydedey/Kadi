import type { Transaction, TransactionDetail, TransactionType } from "@/lib/types/transaction"
import { api } from "./api"

export interface CreateTransactionRequest {
  type: TransactionType
  amount: number
  categoryId?: number
  destinationWalletId?: string
  destinationAmount?: number
  description?: string
  eventDate: string
}

export const getTransactions = async (walletId: string): Promise<TransactionDetail[]> => {
  const { data } = await api.get<TransactionDetail[]>(`/wallet/${walletId}/transactions`)
  return data
}

export const createTransaction = async (
  walletId: string,
  body: CreateTransactionRequest,
): Promise<Transaction> => {
  const { data } = await api.post<Transaction>(`/wallet/${walletId}/transactions`, body)
  return data
}
