import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons/faPizzaSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Subscriptions } from "@/components/Subscriptions"
import { CategoryCard } from "@/components/CategoryCard"
import { AddCategoryLimitDialog } from "@/components/AddCategoryLimitDialog"
import { WalletTabs } from "@/components/WalletTabs/WalletTabs"

export const Wallet = () => {
  return (
    <div className="flex gap-8">
      <WalletTabs />
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
            <AddCategoryLimitDialog />
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
