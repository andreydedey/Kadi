import { Button } from "@/components/ui/button"
import { wallets } from "./Dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router"

export const Wallets = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-medium">Wallets</h1>
        <Button className="cursor-pointer">Add Wallet</Button>
      </div>
      <div className="flex flex-col space-y-5">
        {wallets.map((wallet) => (
          <Link to={"1"}>
            <Card className="w-1/3 hover:bg-accent">
              <CardContent className="flex justify-between">
                <span className="text-xl font-light">{wallet.name}</span>
                <div className="flex gap-3 items-center">
                  <span>{wallet.amount} USD</span>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
