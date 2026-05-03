export type SubscriptionStatus = "ACTIVE" | "INACTIVE"

export interface Subscription {
  id: string
  name: string
  amount: number
  status: SubscriptionStatus
}
