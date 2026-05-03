import { Card, CardContent, CardHeader } from "./ui/card"
import { AddSubscriptionDialog } from "./AddSubscriptionDialog"
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog"
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import { getSubscriptions } from "@/services/subscription"
import { formatMoney } from "@/lib/utils"

interface SubscriptionsProps {
  walletId: string
  currency: string
}

export const Subscriptions = ({ walletId, currency }: SubscriptionsProps) => {
  const { data: subscriptions = [], refetch } = useQuery({
    queryKey: ["subscriptions", walletId],
    queryFn: () => getSubscriptions(walletId),
  })

  return (
    <div className="flex flex-col gap-3 flex-1">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-md text-muted-foreground antialiased">
            Subscriptions
          </h3>
          <AddSubscriptionDialog walletId={walletId} onSuccess={refetch} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="flex items-center justify-between">
              <div className="flex gap-6 items-center">
                <div className="flex rounded-full h-8 aspect-square items-center justify-center bg-zinc-800">
                  <FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-sm" />
                </div>
                <span>{subscription.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>{formatMoney(subscription.amount, currency)}</span>
                <CancelSubscriptionDialog
                  subscriptionId={subscription.id}
                  name={subscription.name}
                  onSuccess={refetch}
                />
              </div>
            </div>
          ))}
          {subscriptions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">No subscriptions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
