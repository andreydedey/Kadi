import { Button } from "@/components/ui/button"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { WalletCard } from "@/components/WalletCard"
import { RemoveAccountAlertDialog } from "@/components/RemoveAccountAlertDialog"
import { useQuery } from "@tanstack/react-query"
import { getWallets } from "@/services/wallet"

export const Settings = () => {
  const { data: walletPage } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => getWallets(),
  })

  const wallets = walletPage?.content ?? []

  return (
    <>
      <h1 className="text-xl font-medium mb-6">Settings</h1>
      <div className="flex gap-12">
        <div className="flex flex-col gap-8 grow-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Your Wallets</h2>
            <p className="text-md text-muted-foreground mb-2">
              You can change the order by dragging.
            </p>
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  title={wallet.name}
                  amount={wallet.balance}
                  currency={wallet.currency}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Remove account</h2>
            <p className="text-md text-muted-foreground">
              Be aware that removing account will erase all the data you have
            </p>
            <RemoveAccountAlertDialog />
          </div>
        </div>
        <div className="space-y-3 grow-4">
          <div className="flex gap-3">
            <FontAwesomeIcon icon={faUser} />
            <span>Andrey Oliveira</span>
          </div>
          <Button size={"lg"} className="w-full">
            Sign out
          </Button>
        </div>
      </div>
    </>
  )
}
