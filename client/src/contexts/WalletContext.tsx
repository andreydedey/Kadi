import { createContext, useContext } from "react"
import type { Wallet } from "@/lib/types/wallet"

const WalletContext = createContext<Wallet | null>(null)

export const WalletProvider = WalletContext.Provider

export function useWallet(): Wallet {
  const wallet = useContext(WalletContext)
  if (!wallet) throw new Error("useWallet must be used within a WalletProvider")
  return wallet
}
