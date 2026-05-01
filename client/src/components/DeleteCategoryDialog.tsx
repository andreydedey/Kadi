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
import { deleteCategory } from "@/services/category"
import { toast } from "sonner"

interface DeleteCategoryDialogProps {
  id: number
  name: string
  onSuccess?: () => void
}

export const DeleteCategoryDialog = ({ id, name, onSuccess }: DeleteCategoryDialogProps) => {
  const { mutate: remove, isPending } = useMutation({
    mutationFn: () => deleteCategory(id),
    onSuccess: () => {
      toast.success(`${name} deleted`)
      onSuccess?.()
    },
    onError: () => toast.error("Failed to delete category"),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg" disabled={isPending}>
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this category. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => remove()}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
