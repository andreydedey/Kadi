import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
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
import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import {
  createWalletSchema,
  type CreateWalletSchema,
} from "@/lib/schemas/createWalletSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Wallet } from "@/lib/types/wallet"
import { toast } from "sonner"
import { api } from "@/services/api"
import { useState } from "react"
import axios from "axios"

export const AddWalletDialog = () => {
  const [open, setOpen] = useState(false)

  const { data: currencies = [] } = useQuery<string[]>({
    queryKey: ["currencies"],
    queryFn: async () => {
      const { data } = await api.get("/wallet/currencies")
      return data
    },
  })

  const createWalletRequest = async (
    body: CreateWalletSchema,
  ): Promise<Wallet> => {
    const { data } = await api.post("/wallet", body)
    return data
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateWalletSchema>({
    resolver: zodResolver(createWalletSchema),
  })

  const { mutate: createWallet, isPending } = useMutation({
    mutationFn: createWalletRequest,
    onSuccess: (wallet) => {
      toast.success(`Wallet ${wallet.name} has been created`)
      setOpen(false)
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to create wallet")
        : "Failed to create wallet"
      toast.error(message)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">Add Wallet</DialogTitle>
          <form onSubmit={handleSubmit((data) => createWallet(data))}>
            <FieldGroup>
              <Field>
                <FieldLabel>
                  Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Bank of America"
                  {...register("name")}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>
                  Currency <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  onValueChange={(v) =>
                    setValue("currency", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError>{errors.currency?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>
                  Balance <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="no-spinners"
                  {...register("balance", { valueAsNumber: true })}
                />
                <FieldError>{errors.balance?.message}</FieldError>
              </Field>
            </FieldGroup>
            <Button className="mt-6 w-full" type="submit" disabled={isPending}>
              Save
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
