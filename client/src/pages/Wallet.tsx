import { Button } from "@/components/ui/button"
import { WalletCard } from "@/components/WalletCard"
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear"
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons/faClockRotateLeft"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons/faClipboardList"

export const Wallet = () => {
  return (
    <div className="flex gap-8">
      <div className="flex flex-1 justify-between">
        <h1 className="text-xl font-medium">Inter</h1>
        <div className="space-x-3">
          <Button variant="outline" size="icon">
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </Button>
          <Button variant="outline" size="icon">
            <FontAwesomeIcon icon={faGear} />
          </Button>
          <Button variant="outline" size="icon">
            <FontAwesomeIcon icon={faClipboardList} />
          </Button>
        </div>
      </div>
      <div>
        <div className="flex justify-between gap-4">
          <WalletCard title={"bank of america"} amount={48463.11} />
          <WalletCard title={"Days before salary"} amount={6} />
        </div>
      </div>
    </div>
  )
}
