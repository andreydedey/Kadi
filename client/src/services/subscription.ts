import type { Subscription } from "@/lib/types/subscription"
import { api } from "./api"

export const getSubscriptions = async (walletId: string): Promise<Subscription[]> => {
  const { data } = await api.get<Subscription[]>(`/subscription/wallet/${walletId}`)
  return data
}

export interface CreateSubscriptionRequest {
  name: string
  amount: number
  categoryId?: number
}

export const createSubscription = async (
  walletId: string,
  body: CreateSubscriptionRequest,
): Promise<Subscription> => {
  const { data } = await api.post<Subscription>(`/subscription/wallet/${walletId}`, body)
  return data
}

export const deleteSubscription = async (subscriptionId: string): Promise<void> => {
  await api.delete(`/subscription/${subscriptionId}`)
}
