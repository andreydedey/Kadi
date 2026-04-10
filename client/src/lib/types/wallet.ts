export interface Wallet {
  id: string
  name: string
  balance: number
  currency: string
}

export interface WalletCategory {
  id: number
  name: string
  spendingLimit: number
  spent: number
}
