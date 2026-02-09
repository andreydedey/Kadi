import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { WalletCard } from "@/components/WalletCard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons"

export const wallets = [
  { name: "Cash", amount: 67000 },
  { name: "Revolut", amount: 89701 },
  { name: "Bank of America", amount: 458111 },
]

export const Dashboard = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <Button className="cursor-pointer">Add Wallet</Button>
      </div>
      <div className="flex space-x-5 mb-6">
        {wallets.map((wallet) => (
          <WalletCard title={wallet.name} amount={wallet.amount} />
        ))}
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-sm text-muted-foreground antialiased">
            Last Transactions
          </h3>
          <Card>
            <CardContent className="flex items-center gap-6">
              <div className="flex rounded-full h-8 aspect-square items-center justify-center bg-zinc-800">
                <FontAwesomeIcon
                  className="text-xs"
                  icon={faArrowRightArrowLeft}
                />
              </div>
              <div className="flex flex-col">
                <strong className="text-green-400">+38 USD</strong>
                <CardDescription>Transfer</CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-sm text-muted-foreground antialiased">
            Total Money
          </h3>
          <Card>
            <CardContent className="flex items-center h-full justify-between">
              <span>24763.10</span>
              <span>USD</span>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-sm antialiased text-muted-foreground">
            All Subscriptions
          </h3>
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex rounded-full h-8 aspect-square items-center justify-center bg-zinc-800">
                  <FontAwesomeIcon
                    className="text-xs"
                    icon={faArrowRightArrowLeft}
                  />
                </div>
                <span>Bank Account Fee</span>
                <span>16.55 USD</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex rounded-full h-8 aspect-square items-center justify-center bg-zinc-800">
                  <FontAwesomeIcon
                    className="text-xs"
                    icon={faArrowRightArrowLeft}
                  />
                </div>
                <span>Bank Account Fee</span>
                <span>16.55 USD</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
