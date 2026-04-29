export interface Wallet {
  id: string
  name: string
  balance: number
  currency: NonNullable<Intl.NumberFormatOptions["currency"]>
}

export interface WalletCategory {
  id: number
  name: string
  spendingLimit: number
  spent: number
}
