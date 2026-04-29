import { Card, CardContent } from "@/components/ui/card"
import { WalletCard } from "@/components/WalletCard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { ItemCard } from "@/components/ItemCard"
import { AddWalletDialog } from "@/components/AddWalletDialog"
import { useQuery } from "@tanstack/react-query"
import { getWallets } from "@/services/wallet"

export const Dashboard = () => {
  const { data } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
  })

  const wallets = data?.content ?? []

  return (
    <>
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <AddWalletDialog />
      </div>
      <div className="flex space-x-5 mb-6">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            title={wallet.name}
            amount={wallet.balance}
            currency={wallet.currency}
          />
        ))}
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-sm text-muted-foreground antialiased">
            Last Transactions
          </h3>
          <ItemCard
            amount={30}
            category="Food"
            icon={faArrowRightArrowLeft}
            type={"EXPENSE"}
            currency={"USD"}
          />
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
