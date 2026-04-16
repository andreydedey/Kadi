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
import { useMutation } from "@tanstack/react-query"
import { deleteWalletCategory } from "@/services/wallet"
import { toast } from "sonner"
import { useParams } from "react-router"

interface RemoveCategoryLimitDialogProps {
  id: number
  category: string
  onSuccess?: () => void
}

export const RemoveCategoryLimitDialog = ({
  id,
  category,
  onSuccess,
}: RemoveCategoryLimitDialogProps) => {
  const { id: walletId } = useParams<{ id: string }>()

  const { mutate: removeLimit, isPending } = useMutation({
    mutationFn: () => deleteWalletCategory(walletId!, id),
    onSuccess: () => {
      toast.success(`${category} limit removed`)
      onSuccess?.()
    },
    onError: () => toast.error("Failed to remove category limit"),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-24" variant="destructive" disabled={isPending}>
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {category} limit?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the spending limit for {category}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => removeLimit()}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
