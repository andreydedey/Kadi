import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card, CardContent, CardHeader } from "./ui/card"
import {
  faArrowRightArrowLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "./ui/button"

type Subscription = {
  name: string
  amount: number
}

interface SubscriptionProps {
  subscriptions: Subscription[]
}

export const Subscriptions: React.FC<SubscriptionProps> = ({
  subscriptions,
}) => {
  return (
    <div className="flex flex-col gap-3 flex-1">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-md text-muted-foreground antialiased">
            Subscriptions
          </h3>
          <Button variant={"outline"}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {subscriptions.map((subscription) => (
            <div className="flex items-center justify-between">
              <div className="flex gap-6 items-center">
                <div className="flex rounded-full h-8 aspect-square items-center justify-center bg-zinc-800">
                  <FontAwesomeIcon
                    className="text-xs"
                    icon={faArrowRightArrowLeft}
                  />
                </div>
                <span>{subscription.name}</span>
              </div>
              <span>{subscription.amount} USD</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
