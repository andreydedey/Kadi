import { Button } from "@/components/ui/button"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { WalletCard } from "@/components/WalletCard"

export const Settings = () => {
  const wallets = [
    { title: "Inter", amount: 2034 },
    { title: "PicPay", amount: 3528 },
  ]

  return (
    <>
      <h1 className="text-xl font-medium mb-6">Settings</h1>
      <div className="flex gap-12">
        <div className="flex flex-col gap-8 grow-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Salary Day</h2>
            <p className="text-md text-muted-foreground">
              Analytics are calculated for one month, starting from the salary
              day.
            </p>
            <Field>
              <Input id="salary-day" type="number" className="py-6" />
            </Field>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Your Wallets</h2>
            <p className="text-md text-muted-foreground mb-2">
              You can change the order by dragging.
            </p>
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <WalletCard title={wallet.title} amount={wallet.amount} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Remove account</h2>
            <p className="text-md text-muted-foreground">
              Be aware that removing account will erase all the data you have
            </p>
            <Button variant="destructive" className="grow">
              Remove acoount
            </Button>
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
