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
import { useMutation } from "@tanstack/react-query"
import { completeSubscription } from "@/services/subscription"
import { format } from "date-fns"
import { toast } from "sonner"

interface MarkSubscriptionAsCompletedDialogProps {
  subscriptionId: string
  subscriptionName: string
  icon: IconProp
  onSuccess: () => void
}

export const MarkSubscriptionAsCompletedDialog: React.FC<
  MarkSubscriptionAsCompletedDialogProps
> = ({ subscriptionId, subscriptionName, icon, onSuccess }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date())

  const { mutate: complete, isPending } = useMutation({
    mutationFn: () => completeSubscription(subscriptionId, format(eventDate!, "yyyy-MM-dd")),
    onSuccess: () => {
      toast.success(`Transaction added for "${subscriptionName}"`)
      setOpen(false)
      onSuccess()
    },
    onError: () => {
      toast.error("Failed to complete subscription")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            This will add an expense transaction for{" "}
            <span className="font-medium">"{subscriptionName}"</span> on the
            selected date.
          </p>
          <DatePicker
            label="Event date"
            defaultValue={new Date()}
            onSelect={setEventDate}
          />
        </div>
        <Button className="w-full" disabled={!eventDate || isPending} onClick={() => complete()}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  )
}
