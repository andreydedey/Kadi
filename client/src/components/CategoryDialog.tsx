import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { REQUIRED } from "@/lib/consts"
import { useMutation } from "@tanstack/react-query"
import { createCategory, updateCategory, type CategoryDetail } from "@/services/category"
import { toast } from "sonner"
import axios from "axios"
import { MoneyInput } from "./ui/money-input"

const categorySchema = z.object({
  name: z.string({ error: REQUIRED }).min(1, REQUIRED),
  limit: z.number().optional(),
})

type CategorySchema = z.infer<typeof categorySchema>

interface CategoryDialogProps {
  onSuccess?: () => void
  editing?: CategoryDetail
}

interface CategoryContentProps {
  onSuccess?: () => void
  onClose: () => void
  editing?: CategoryDetail
}

const CategoryContent = ({ onSuccess, onClose, editing }: CategoryContentProps) => {
  const isEditing = !!editing

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: editing
      ? { name: editing.name, limit: editing.globalLimit ?? undefined }
      : undefined,
  })

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data: CategorySchema) =>
      isEditing
        ? updateCategory(editing!.id, data)
        : createCategory(data),
    onSuccess: () => {
      toast.success(isEditing ? "Category updated" : "Category created")
      onSuccess?.()
      onClose()
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to save category")
        : "Failed to save category"
      toast.error(message)
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => save(data))}>
      <FieldGroup>
        <Field>
          <FieldLabel>
            Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input type="text" placeholder="e.g. Food, Travel, Health..." {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Global spending limit</FieldLabel>
          <MoneyInput
            defaultValue={editing?.globalLimit ?? undefined}
            onChange={(cents) => setValue("limit", cents || undefined)}
          />
          <FieldError>{errors.limit?.message}</FieldError>
        </Field>
      </FieldGroup>
      <Button className="mt-4 w-full" type="submit" disabled={isPending}>
        Save
      </Button>
    </form>
  )
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({ onSuccess, editing }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {editing ? (
        <Button variant="secondary" size="lg" onClick={() => setOpen(true)}>
          Edit
        </Button>
      ) : (
        <DialogTrigger asChild>
          <Button size="lg">Add Category</Button>
        </DialogTrigger>
      )}
      {open && (
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <CategoryContent onSuccess={onSuccess} onClose={() => setOpen(false)} editing={editing} />
        </DialogContent>
      )}
    </Dialog>
  )
}
