import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons/faPizzaSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Subscriptions } from "@/components/Subscriptions"
import { CategoryCard } from "@/components/CategoryCard"
import { CategoryLimitDialog } from "@/components/CategoryLimitDialog"
import { WalletTabs } from "@/components/WalletTabs/WalletTabs"
import { formatMoney } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getWallet, getWalletCategories } from "@/services/wallet"
import { useParams } from "react-router"
import { WalletProvider } from "@/contexts/WalletContext"

export const WalletPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data: wallet } = useQuery({
    queryKey: ["wallets", id],
    queryFn: () => getWallet(id!),
  })

  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ["wallets", id, "categories"],
    queryFn: () => getWalletCategories(id!),
  })

  if (!wallet) return null

  return (
    <WalletProvider value={wallet}>
    <div className="flex gap-8">
      <WalletTabs />
      <div className="space-y-6 flex-2">
        <div className="flex justify-between gap-4">
          <Card className="gap-1 border-none flex-1">
            <CardHeader className="margin">
              <CardTitle className="font-light">{wallet.name}</CardTitle>
            </CardHeader>
            <CardContent className="font-medium text-xl">
              {formatMoney(wallet.balance, wallet.currency)}
            </CardContent>
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
            <CategoryLimitDialog onSuccess={refetchCategories} />
          </CardHeader>
          <CardContent>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                category={cat.name}
                icon={faPizzaSlice}
                spendingLimit={cat.spendingLimit}
                spent={cat.spent}
                onSuccess={refetchCategories}
              />
            ))}
          </CardContent>
        </Card>
        <Subscriptions subscriptions={[{ name: "Netflix", amount: 32.12 }]} />
      </div>
    </div>
    </WalletProvider>
  )
}
