import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons/faPizzaSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Subscriptions } from "@/components/Subscriptions"
import { CategoryCard } from "@/components/CategoryCard"
import { AddCategoryLimitDialog } from "@/components/AddCategoryLimitDialog"
import { WalletTabs } from "@/components/WalletTabs/WalletTabs"
import type { Wallet } from "@/lib/types/wallet"
import { formatMoney } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { getWalletCategories } from "@/services/wallet"

interface WalletComponentProps {
  wallet: Wallet
}

export const WalletComponent: React.FC<WalletComponentProps> = ({ wallet }) => {
  const { data: categories = [] } = useQuery({
    queryKey: ["wallets", wallet.id, "categories"],
    queryFn: () => getWalletCategories(wallet.id),
  })

  return (
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
            <AddCategoryLimitDialog />
          </CardHeader>
          <CardContent>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat.name}
                icon={faPizzaSlice}
                spendingLimit={cat.spendingLimit}
                spent={cat.spent}
                currency={wallet.currency}
              />
            ))}
          </CardContent>
        </Card>
        <Subscriptions subscriptions={[{ name: "Netflix", amount: 32.12 }]} />
      </div>
    </div>
  )
}
