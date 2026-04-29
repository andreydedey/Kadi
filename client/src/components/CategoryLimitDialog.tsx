import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useState } from "react"
import { Input } from "./ui/input"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getCategories } from "@/services/category"
import { createWalletCategory, updateWalletCategory } from "@/services/wallet"
import { toast } from "sonner"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { walletCategorySchema, type WalletCategorySchema } from "@/lib/schemas/walletCategorySchema"
import { useParams } from "react-router"

interface EditingCategory {
  id: number
  categoryId: number
  categoryName: string
  spendingLimit: number
}

interface CategoryLimitDialogProps {
  onSuccess?: () => void
  editing?: EditingCategory
}

interface CategoryLimitContentProps {
  onSuccess?: () => void
  onClose: () => void
  editing?: EditingCategory
}

const CategoryLimitContent = ({ onSuccess, onClose, editing }: CategoryLimitContentProps) => {
  const { id: walletId } = useParams<{ id: string }>()

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WalletCategorySchema>({
    resolver: zodResolver(walletCategorySchema),
    defaultValues: editing
      ? { categoryId: editing.categoryId, spendingLimit: editing.spendingLimit }
      : undefined,
  })

  const { mutate: saveLimit, isPending } = useMutation({
    mutationFn: (data: WalletCategorySchema) =>
      editing
        ? updateWalletCategory(walletId!, editing.id, data)
        : createWalletCategory(walletId!, data),
    onSuccess: () => {
      toast.success(editing ? "Category limit updated" : "Category limit added")
      onSuccess?.()
      onClose()
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to save category limit")
        : "Failed to save category limit"
      toast.error(message)
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => saveLimit(data))}>
      <FieldGroup>
        <Field>
          <FieldLabel>
            Category <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            defaultValue={editing ? String(editing.categoryId) : undefined}
            onValueChange={(v) => setValue("categoryId", Number(v), { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError>{errors.categoryId?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>
            Amount <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            type="number"
            placeholder="0.00"
            className="no-spinners"
            {...register("spendingLimit", { valueAsNumber: true })}
          />
          <FieldError>{errors.spendingLimit?.message}</FieldError>
        </Field>
      </FieldGroup>
      <Button className="mt-6 w-full" type="submit" disabled={isPending}>
        Save
      </Button>
    </form>
  )
}

export const CategoryLimitDialog = ({ onSuccess, editing }: CategoryLimitDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {editing ? (
        <Button variant="secondary" className="w-24" onClick={() => setOpen(true)}>
          Edit
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      )}
      {open && (
        <DialogContent>
          <DialogHeader>{editing ? "Edit Category Limit" : "Add Limits by Category"}</DialogHeader>
          <CategoryLimitContent onSuccess={onSuccess} onClose={() => setOpen(false)} editing={editing} />
        </DialogContent>
      )}
    </Dialog>
  )
}
