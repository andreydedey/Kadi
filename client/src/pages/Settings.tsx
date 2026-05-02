import { Button } from "@/components/ui/button"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { WalletCard } from "@/components/WalletCard"
import { RemoveAccountAlertDialog } from "@/components/RemoveAccountAlertDialog"
import { useQuery } from "@tanstack/react-query"
import { getWallets } from "@/services/wallet"
import { useAuth } from "@/contexts/AuthContext"
import { EditProfileDialog } from "@/components/EditProfileDialog"
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export const Settings = () => {
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  const { data: walletPage } = useQuery({
    queryKey: ["wallets"],
    queryFn: () => getWallets(),
  })

  const wallets = walletPage?.content ?? []

  return (
    <>
      <h1 className="text-xl font-medium mb-6">Settings</h1>
      <EditProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <ChangePasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
      <div className="flex gap-12">
        <div className="flex flex-col gap-8 grow-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Profile</h2>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setProfileOpen(true)}
                >
                  Edit profile
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setPasswordOpen(true)}
                >
                  Change password
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Display name</p>
                  <p className="font-medium">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Default display currency
                  </p>
                  <p className="font-medium">
                    {user?.defaultCurrency ?? "Not set"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-medium">Your Wallets</h2>
            <p className="text-sm text-muted-foreground">
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
            <p className="text-sm text-muted-foreground">
              Be aware that removing account will erase all the data you have
            </p>
            <RemoveAccountAlertDialog />
          </div>
        </div>

        <div className="space-y-3 grow-4">
          <div className="flex gap-3 items-center">
            <FontAwesomeIcon icon={faUser} />
            <span>{user?.username}</span>
          </div>
          <Button size="lg" className="w-full" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </>
  )
}
