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
import { createWalletCategory } from "@/services/wallet"
import { toast } from "sonner"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createWalletCategorySchema,
  type CreateWalletCategorySchema,
} from "@/lib/schemas/createWalletCategorySchema"

interface AddCategoryLimitDialogProps {
  walletId: string
}

export const AddCategoryLimitDialog = ({ walletId }: AddCategoryLimitDialogProps) => {
  const [open, setOpen] = useState(false)

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateWalletCategorySchema>({
    resolver: zodResolver(createWalletCategorySchema),
  })

  const { mutate: addLimit, isPending } = useMutation({
    mutationFn: (data: CreateWalletCategorySchema) => createWalletCategory(walletId, data),
    onSuccess: () => {
      toast.success("Category limit added")
      setOpen(false)
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to add category limit")
        : "Failed to add category limit"
      toast.error(message)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <DialogContent>
        <DialogHeader>Add Limits by Category</DialogHeader>
        <form onSubmit={handleSubmit((data) => addLimit(data))}>
          <FieldGroup>
            <Field>
              <FieldLabel>
                Category <span className="text-destructive">*</span>
              </FieldLabel>
              <Select onValueChange={(v) => setValue("categoryId", Number(v), { shouldValidate: true })}>
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
      </DialogContent>
    </Dialog>
  )
}
