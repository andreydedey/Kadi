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
  categoryId: number | null
  categoryName: string | null
  destinationWalletId: string | null
  destinationAmount: number | null
  description: string | null
  eventDate: string
}

export interface WeeklyCategoryBreakdown {
  categoryId: number | null
  categoryName: string
  amount: number
  percentage: number
}

export interface WeeklyTransactionSummary {
  weekLabel: string
  startDate: string
  endDate: string
  totalExpense: number
  totalIncome: number
  expenseCategories: WeeklyCategoryBreakdown[]
  incomeCategories: WeeklyCategoryBreakdown[]
}
