import { Button } from "@/components/ui/button"
import { WalletCard } from "@/components/WalletCard"
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear"
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons/faClockRotateLeft"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons/faClipboardList"
import { ItemCard } from "@/components/ItemCard"
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons/faPizzaSlice"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ProgressWithLabel } from "@/components/ProgressWithLabel"
import { Subscriptions } from "@/components/Subscriptions"

export const Wallet = () => {
  return (
    <div className="flex gap-8">
      <div className="flex flex-1 flex-col gap-6">
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
          <Button>Add Transaction</Button>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm text-muted-foreground antialiased">
            Jan 1, 2024
          </h3>
          <ItemCard amount={40} category="Food" icon={faPizzaSlice} />
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between gap-4">
          <WalletCard title={"bank of america"} amount={48463.11} />
          <WalletCard title={"Days before salary"} amount={6} />
        </div>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-md text-muted-foreground antialiased">
              Limits by Category
            </h3>
            <Button variant={"outline"}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex rounded-full h-12 aspect-square items-center justify-center bg-zinc-800">
                <FontAwesomeIcon icon={faPizzaSlice} />
              </div>
              <ProgressWithLabel category="Food" progress={66} />
            </div>
          </CardContent>
        </Card>
        <Subscriptions subscriptions={[{ name: "Netflix", amount: 32.12 }]} />
      </div>
    </div>
  )
}
