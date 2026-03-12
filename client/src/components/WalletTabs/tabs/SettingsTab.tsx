import { EditWalletDialog } from "@/components/EditWalletDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const SettingsTab = () => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h2 className="text-muted-foreground text-xl">Wallet Informations</h2>
        <EditWalletDialog />
      </div>
      <Card>
        <CardContent>
          <h3 className="text-muted-foreground">Wallet name</h3>
          <h3 className="text-lg font-bold">Inter</h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="text-muted-foreground">Currency</h3>
          <h3 className="text-lg font-bold">USD - USD Dollar</h3>
        </CardContent>
      </Card>
      <h2 className="text-muted-foreground text-xl">Salary Settings</h2>
      <Card>
        <CardContent>
          <h3 className="text-muted-foreground">Salary day</h3>
          <h3 className="text-lg font-bold">Day 8 of each month</h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="text-muted-foreground">Expected monthly income</h3>
          <h3 className="text-lg font-bold">36183.00 USD</h3>
        </CardContent>
      </Card>
      <h2 className="text-xl">Danger Zone</h2>
      <Card>
        <CardContent className="flex flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-yellow-400">
              Archive Wallet
            </h3>
            <h3 className="text-muted-foreground">
              Hide this wallet without deleting data
            </h3>
          </div>
          <Button variant={"ghost"} size={"icon"}>
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
        </CardContent>
      </Card>
      <Card className="bg-destructive/20">
        <CardContent className="flex flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-destructive">
              Delete Wallet
            </h3>
            <h3 className="text-muted-foreground">
              Permanently delete this wallet and all of it's data
            </h3>
          </div>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-white/15!"
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
