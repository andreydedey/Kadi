import { AddWalletDialog } from "@/components/AddWalletDialog"
import { Card, CardContent } from "@/components/ui/card"
import { formatMoney } from "@/lib/utils"
import { getWallets } from "@/services/wallet"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router"

export const Wallets = () => {
  const { data, refetch } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
  })

  const wallets = data?.content ?? []

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Wallets</h1>
        <AddWalletDialog onWalletCreated={refetch} />
      </div>
      <div className="flex flex-col space-y-5">
        {wallets.map((wallet) => (
          <Link to={wallet.id}>
            <Card className="w-1/3 hover:bg-accent border-0">
              <CardContent className="flex justify-between">
                <span className="text-xl font-light">{wallet.name}</span>
                <span>{formatMoney(wallet.balance, wallet.currency)}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
