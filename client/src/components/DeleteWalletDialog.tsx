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
import { Button } from "./ui/button"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMutation } from "@tanstack/react-query"
import { deleteWallet } from "@/services/wallet"
import { toast } from "sonner"
import { useNavigate } from "react-router"

interface DeleteWalletDialogProps {
  walletId: string
  walletName: string
}

export const DeleteWalletDialog = ({ walletId, walletName }: DeleteWalletDialogProps) => {
  const navigate = useNavigate()

  const { mutate: remove, isPending } = useMutation({
    mutationFn: () => deleteWallet(walletId),
    onSuccess: () => {
      toast.success(`"${walletName}" deleted`)
      navigate("/")
    },
    onError: () => toast.error("Failed to delete wallet"),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-white/15!">
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete wallet</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete "{walletName}"? This will erase all transactions, subscriptions, and category limits. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => remove()}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
