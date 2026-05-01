import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { useMutation } from "@tanstack/react-query"
import { deleteTransaction } from "@/services/transaction"
import { useParams } from "react-router"
import { toast } from "sonner"

interface DeleteTransactionDialogProps {
  transactionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const DeleteTransactionDialog = ({
  transactionId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTransactionDialogProps) => {
  const { id: walletId } = useParams<{ id: string }>()

  const { mutate: remove, isPending } = useMutation({
    mutationFn: () => deleteTransaction(walletId!, transactionId),
    onSuccess: () => {
      toast.success("Transaction deleted")
      onSuccess?.()
      onOpenChange(false)
    },
    onError: () => toast.error("Failed to delete transaction"),
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this transaction and reverse its effects on your balance. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={() => remove()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
