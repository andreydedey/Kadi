import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight"
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoneyInput } from "@/components/ui/money-input"
import { DatePicker } from "@/components/DatePicker"
import { useQuery } from "@tanstack/react-query"
import { getWallets } from "@/services/wallet"
import type { UseFormReturn } from "react-hook-form"
import type { TransferSchema } from "@/lib/schemas/transactionSchema"
import { useParams } from "react-router"

interface TransferTabProps {
  form: UseFormReturn<TransferSchema>
}

export const TransferTab: React.FC<TransferTabProps> = ({ form }) => {
  const { register, setValue, formState: { errors } } = form
  const { id: currentWalletId } = useParams<{ id: string }>()

  const { data: walletsPage } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
  })

  const otherWallets = walletsPage?.content.filter((w) => w.id !== currentWalletId) ?? []

  return (
    <FieldSet className="grid grid-cols-10 gap-4 mt-2 mb-6">
      <Field className="col-span-4">
        <FieldLabel className="text-muted-foreground">From</FieldLabel>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Current wallet" />
          </SelectTrigger>
        </Select>
      </Field>
      <FontAwesomeIcon
        className="col-span-2 self-end justify-self-center mb-2"
        icon={faArrowRight}
      />
      <Field className="col-span-4">
        <FieldLabel className="text-muted-foreground">To</FieldLabel>
        <Select onValueChange={(v) => setValue("destinationWalletId", v, { shouldValidate: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose the wallet" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {otherWallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id}>
                  {wallet.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldError>{errors.destinationWalletId?.message}</FieldError>
      </Field>
      <Field className="col-span-4">
        <FieldLabel className="text-muted-foreground">
          Amount <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          type="number"
          placeholder="0.00"
          className="no-spinners"
          {...register("amount", { valueAsNumber: true })}
        />
        <FieldError>{errors.amount?.message}</FieldError>
      </Field>
      <div className="col-span-2" />
      <Field className="col-span-4">
        <FieldLabel className="text-muted-foreground">
          Amount <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          type="number"
          placeholder="0.00"
          className="no-spinners"
          {...register("destinationAmount", { valueAsNumber: true })}
        />
        <FieldError>{errors.destinationAmount?.message}</FieldError>
      </Field>
      <Field className="col-span-10">
        <FieldLabel className="text-muted-foreground">Description</FieldLabel>
        <Input type="text" placeholder="Just saved some money" {...register("description")} />
      </Field>
      <div className="col-span-10">
        <DatePicker
          label="Event date"
          onSelect={(date) => setValue("eventDate", date?.toISOString().split("T")[0] ?? "", { shouldValidate: true })}
        />
        <FieldError>{errors.eventDate?.message}</FieldError>
      </div>
    </FieldSet>
  )
}
