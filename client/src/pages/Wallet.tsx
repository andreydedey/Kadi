import { Button } from "@/components/ui/button"
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear"
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons/faClockRotateLeft"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons/faClipboardList"
import { ItemCard } from "@/components/ItemCard"
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons/faPizzaSlice"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Subscriptions } from "@/components/Subscriptions"
import { AddTransactionDialog } from "@/components/AddTransactionDialog/AddTransactionDialog"
import { CategoryCard } from "@/components/CategoryCard"

export const Wallet = () => {
  return (
    <div className="flex gap-8">
      <div className="flex flex-3 flex-col gap-6">
        <div className="flex justify-between">
          <h1 className="text-xl font-medium">Inter (USD)</h1>
          <div className="space-x-3">
            <Button variant="outline" size="icon">
              <FontAwesomeIcon icon={faClockRotateLeft} />
            </Button>
            <Button variant="outline" size="icon">
              <FontAwesomeIcon icon={faGear} />
            </Button>
            <Button variant="outline" size="icon">
              <FontAwesomeIcon icon={faClipboardList} />
            </Button>
          </div>
        </div>
        <div className="flex justify-between">
          <h2 className="text-md">Transactions</h2>
          <AddTransactionDialog />
        </div>
        <div className="space-y-4">
          <h3 className="text-sm text-muted-foreground antialiased">
            Jan 1, 2024
          </h3>
          <ItemCard amount={40} category="Food" icon={faPizzaSlice} />
        </div>
      </div>
      <div className="space-y-6 flex-2">
        <div className="flex justify-between gap-4">
          <Card className="gap-1 border-none flex-1">
            <CardHeader className="margin">
              <CardTitle className="font-light">Inter</CardTitle>
            </CardHeader>
            <CardContent className="font-medium text-xl">23483 USD</CardContent>
          </Card>
          <Card className="gap-1 border-none flex-1">
            <CardHeader className="margin">
              <CardTitle className="font-light">Days before salary</CardTitle>
            </CardHeader>
            <CardContent className="font-medium text-xl">6 days</CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-md text-muted-foreground antialiased">
              Limits by Category
            </h3>
            <Button
              variant={"outline"}
              className="bg-transparent! border-0 p-0! text-muted-foreground text-md"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </CardHeader>
          <CardContent>
            <CategoryCard category="Food" icon={faPizzaSlice} />
          </CardContent>
        </Card>
        <Subscriptions subscriptions={[{ name: "Netflix", amount: 32.12 }]} />
      </div>
    </div>
  )
}
