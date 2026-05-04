import { EditWalletDialog } from "@/components/EditWalletDialog"
import { ArchiveWalletDialog } from "@/components/ArchiveWalletDialog"
import { DeleteWalletDialog } from "@/components/DeleteWalletDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWallet } from "@/contexts/WalletContext"
import { formatMoney } from "@/lib/utils"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

export const SettingsTab = () => {
  const wallet = useWallet()
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h2 className="text-muted-foreground text-xl">Wallet Informations</h2>
        <Button
          className="cursor-pointer hover:bg-accent-foreground"
          variant="ghost"
          size="icon"
          onClick={() => setEditOpen(true)}
        >
          <FontAwesomeIcon className="text-lg" icon={faEdit} />
        </Button>
      </div>
      <EditWalletDialog open={editOpen} onClose={() => setEditOpen(false)} />
      <Card>
        <CardContent>
          <h3 className="text-muted-foreground">Wallet name</h3>
          <h3 className="text-lg font-bold">{wallet.name}</h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="text-muted-foreground">Currency</h3>
          <h3 className="text-lg font-bold">{wallet.currency}</h3>
        </CardContent>
      </Card>
      <h2 className="text-muted-foreground text-xl">Salary Settings</h2>
      <Card>
        <CardContent>
          <h3 className="text-muted-foreground">Salary day</h3>
          <h3 className="text-lg font-bold">
            {wallet.salaryDay ? `Day ${wallet.salaryDay} of each month` : "Not set"}
          </h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="text-muted-foreground">Expected monthly income</h3>
          <h3 className="text-lg font-bold">
            {wallet.expectedMonthlyIncome
              ? formatMoney(wallet.expectedMonthlyIncome, wallet.currency)
              : "Not set"}
          </h3>
        </CardContent>
      </Card>
      <h2 className="text-xl">Danger Zone</h2>
      <Card>
        <CardContent className="flex flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-yellow-400">Archive Wallet</h3>
            <h3 className="text-muted-foreground">
              Hide this wallet without deleting data
            </h3>
          </div>
          <ArchiveWalletDialog walletId={wallet.id} walletName={wallet.name} />
        </CardContent>
      </Card>
      <Card className="bg-destructive/20">
        <CardContent className="flex flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-destructive">Delete Wallet</h3>
            <h3 className="text-muted-foreground">
              Permanently delete this wallet and all of it's data
            </h3>
          </div>
          <DeleteWalletDialog walletId={wallet.id} walletName={wallet.name} />
        </CardContent>
      </Card>
    </div>
  )
}
