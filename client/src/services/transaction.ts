import type { Transaction, TransactionDetail, TransactionType, WeeklyTransactionSummary } from "@/lib/types/transaction"
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

export const updateTransaction = async (
  walletId: string,
  transactionId: string,
  body: CreateTransactionRequest,
): Promise<Transaction> => {
  const { data } = await api.put<Transaction>(`/wallet/${walletId}/transactions/${transactionId}`, body)
  return data
}

export const deleteTransaction = async (walletId: string, transactionId: string): Promise<void> => {
  await api.delete(`/wallet/${walletId}/transactions/${transactionId}`)
}

export const getTransactionsSummary = async (walletId: string): Promise<WeeklyTransactionSummary[]> => {
  const { data } = await api.get<WeeklyTransactionSummary[]>(`/wallet/${walletId}/transactions/summary`)
  return data
}
