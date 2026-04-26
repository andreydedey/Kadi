export type TransactionType = "EXPENSE" | "INCOME" | "TRANSFER"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  categoryId: number | null
  destinationWalletId: string | null
  destinationAmount: number | null
  description: string | null
  eventDate: string
}

export interface TransactionDetail {
  id: string
  type: TransactionType
  amount: number
  categoryName: string | null
  destinationWalletId: string | null
  destinationAmount: number | null
  description: string | null
  eventDate: string
}
