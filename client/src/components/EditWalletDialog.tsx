import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group"
import { useWallet } from "@/contexts/WalletContext"
import { Controller, useForm } from "react-hook-form"
import { updateWallet } from "@/services/wallet"
import { useQueryClient } from "@tanstack/react-query"
import { MoneyInput } from "./ui/money-input"
import { toast } from "sonner"

interface FormValues {
  name: string
  salaryDay: string
  expectedMonthlyIncome: number | undefined
}

const EditWalletContent = ({ onClose }: { onClose: () => void }) => {
  const wallet = useWallet()
  const queryClient = useQueryClient()

  const { register, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      name: wallet.name,
      salaryDay: wallet.salaryDay?.toString() ?? "",
      expectedMonthlyIncome: wallet.expectedMonthlyIncome ?? undefined,
    },
  })

  const onSubmit = async (values: FormValues) => {
    await updateWallet(wallet.id, {
      name: values.name,
      salaryDay: values.salaryDay ? parseInt(values.salaryDay) : undefined,
      expectedMonthlyIncome: values.expectedMonthlyIncome,
    })
    await queryClient.invalidateQueries({ queryKey: ["wallets", wallet.id] })
    toast.success("Wallet updated")
    onClose()
  }

  return (
    <DialogContent notDismissible>
      <DialogHeader>
        <DialogTitle>Edit Wallet Information</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <FieldLabel>
            Wallet name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input type="text" placeholder="Savings" {...register("name", { required: true })} />
          <FieldLabel className="text-muted-foreground">
            Currency (cannot be changed)
          </FieldLabel>
          <Input type="text" value={wallet.currency} disabled />
        </Field>
        <FieldGroup className="flex flex-row gap-6 mt-3">
          <Field>
            <FieldLabel>Salary day</FieldLabel>
            <InputGroup>
              <InputGroupInput
                placeholder="12"
                type="number"
                min={1}
                max={31}
                {...register("salaryDay")}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>day of month</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <span className="text-muted-foreground text-xs">Between 1 and 31</span>
          </Field>
          <Field>
            <FieldLabel>Expected monthly income</FieldLabel>
            <Controller
              name="expectedMonthlyIncome"
              control={control}
              render={({ field }) => (
                <MoneyInput
                  defaultValue={wallet.expectedMonthlyIncome ?? undefined}
                  onChange={(cents) => field.onChange(cents)}
                />
              )}
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="w-full *:flex-1 mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export const EditWalletDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      {open && <EditWalletContent onClose={onClose} />}
    </Dialog>
  )
}
