import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import type { IconProp } from "@fortawesome/fontawesome-svg-core"
import { DatePicker } from "./DatePicker"
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck"
import { useState } from "react"

interface MarkSubscriptionAsCompletedDialogProps {
  icon: IconProp
}

export const MarkSubscriptionAsCompletedDialog: React.FC<
  MarkSubscriptionAsCompletedDialogProps
> = ({ icon }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="h-4 w-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FontAwesomeIcon
            icon={isHovered ? faCheck : icon}
            className="transition-all duration-200 ease-in-out"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Mark Subscription as Completed</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p>
            This actions will add transaction and mark "subscription here" as
            completed
          </p>
          <DatePicker label="Event date" />
        </div>
        <Button>Save</Button>
      </DialogContent>
    </Dialog>
  )
}
