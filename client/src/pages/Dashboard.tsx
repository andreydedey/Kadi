import { Card, CardContent } from "@/components/ui/card"
import { WalletCard } from "@/components/WalletCard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { AddWalletDialog } from "@/components/AddWalletDialog"
import { useQuery } from "@tanstack/react-query"
import { getWallets } from "@/services/wallet"
import { getRecentTransactions } from "@/services/transaction"
import { getSubscriptions } from "@/services/subscription"
import { useAuth } from "@/contexts/AuthContext"
import { formatMoney } from "@/lib/utils"
import { Link } from "react-router"

export const Dashboard = () => {
  const { user } = useAuth()
  const displayCurrency = user?.defaultCurrency ?? "USD"

  const { data: walletPage, refetch: refetchWallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
  })

  const { data: transactions = [] } = useQuery({
    queryKey: ["transaction"],
    queryFn: () => getRecentTransactions(),
  })

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscriptions", "all"],
    queryFn: () => getSubscriptions(),
  })

  const wallets = walletPage?.content ?? []
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  return (
    <>
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <AddWalletDialog onWalletCreated={refetchWallets} />
      </div>
      <div className="flex space-x-5 mb-6">
        {wallets.map((wallet) => (
          <Link key={wallet.id} to={`/wallets/${wallet.id}`}>
            <WalletCard
              title={wallet.name}
              amount={wallet.balance}
              currency={wallet.currency}
            />
          </Link>
        ))}
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-sm text-muted-foreground antialiased">Last Transactions</h3>
          <Card>
            <CardContent className="flex flex-col gap-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <span className="text-sm text-muted-foreground">{transaction.eventDate}</span>
                    <span>{transaction.description ?? transaction.categoryName ?? transaction.type.toLowerCase()}</span>
                  </div>
                  <span className={transaction.type === "INCOME" ? "text-green-400" : "text-destructive"}>
                    {transaction.type === "INCOME" ? "+" : "-"}{formatMoney(transaction.amount, displayCurrency)}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">No transactions yet</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-sm text-muted-foreground antialiased">Total Money</h3>
          <Card>
            <CardContent className="flex items-center h-full justify-between">
              <span className="text-xl font-semibold">{formatMoney(totalBalance, displayCurrency)}</span>
              <span className="text-muted-foreground">{displayCurrency}</span>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-sm antialiased text-muted-foreground">All Subscriptions</h3>
          <Card>
            <CardContent className="flex flex-col gap-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="flex rounded-full h-8 aspect-square items-center justify-center bg-zinc-800">
                      <FontAwesomeIcon className="text-xs" icon={faArrowRightArrowLeft} />
                    </div>
                    <span>{subscription.name}</span>
                  </div>
                  <span>{formatMoney(subscription.amount, displayCurrency)}</span>
                </div>
              ))}
              {subscriptions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">No subscriptions yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
