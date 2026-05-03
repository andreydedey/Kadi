import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { useMutation } from "@tanstack/react-query"
import { deleteSubscription } from "@/services/subscription"
import { toast } from "sonner"

interface CancelSubscriptionDialogProps {
  subscriptionId: string
  name: string
  onSuccess: () => void
}

export const CancelSubscriptionDialog = ({
  subscriptionId,
  name,
  onSuccess,
}: CancelSubscriptionDialogProps) => {
  const { mutate: cancel, isPending } = useMutation({
    mutationFn: () => deleteSubscription(subscriptionId),
    onSuccess: () => {
      toast.success(`"${name}" subscription cancelled`)
      onSuccess()
    },
    onError: () => toast.error("Failed to cancel subscription"),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel "{name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => cancel()}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Cancel subscription
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
