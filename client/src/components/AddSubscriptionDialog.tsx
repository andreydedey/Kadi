import { useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { REQUIRED } from "@/lib/consts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createSubscription } from "@/services/subscription"
import { getCategories } from "@/services/category"
import { MoneyInput } from "./ui/money-input"
import { toast } from "sonner"

const subscriptionSchema = z.object({
  name: z.string({ error: REQUIRED }).min(1, REQUIRED),
  amount: z.number({ error: REQUIRED }).min(1, "Amount is required"),
  categoryId: z.number().optional(),
})

type SubscriptionSchema = z.infer<typeof subscriptionSchema>

interface AddSubscriptionDialogProps {
  walletId: string
  onSuccess: () => void
}

const AddSubscriptionContent = ({
  walletId,
  onSuccess,
  onClose,
}: AddSubscriptionDialogProps & { onClose: () => void }) => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionSchema>({ resolver: zodResolver(subscriptionSchema) })

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data: SubscriptionSchema) =>
      createSubscription(walletId, {
        name: data.name,
        amount: data.amount,
        categoryId: data.categoryId,
      }),
    onSuccess: () => {
      toast.success("Subscription added")
      onSuccess()
      onClose()
    },
    onError: () => toast.error("Failed to add subscription"),
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Subscription</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit((data) => save(data))}>
        <FieldGroup>
          <Field>
            <FieldLabel>
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input type="text" placeholder="Netflix" {...register("name")} />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Category</FieldLabel>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value != null ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
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
              )}
            />
          </Field>
          <Field>
            <FieldLabel>
              Amount <span className="text-destructive">*</span>
            </FieldLabel>
            <MoneyInput onChange={(cents) => setValue("amount", cents, { shouldValidate: true })} />
            <FieldError>{errors.amount?.message}</FieldError>
          </Field>
        </FieldGroup>
        <DialogFooter className="w-full *:flex-1 mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export const AddSubscriptionDialog = ({ walletId, onSuccess }: AddSubscriptionDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent! border-0 p-0! text-muted-foreground text-md"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </DialogTrigger>
      {open && (
        <AddSubscriptionContent
          walletId={walletId}
          onSuccess={onSuccess}
          onClose={() => setOpen(false)}
        />
      )}
    </Dialog>
  )
}
