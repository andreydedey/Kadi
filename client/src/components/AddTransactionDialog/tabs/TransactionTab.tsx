import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/DatePicker"
import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/services/category"
import type { UseFormReturn } from "react-hook-form"
import type { TransactionSchema } from "@/lib/schemas/transactionSchema"

interface TransactionTabProps {
  isExpense?: boolean
  form: UseFormReturn<TransactionSchema>
}

export const TransactionTab: React.FC<TransactionTabProps> = ({ form }) => {
  const { register, setValue, formState: { errors } } = form

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  return (
    <FieldSet className="flex-1 flex flex-col gap-4 mt-2 mb-6">
      <FieldGroup className="flex flex-row">
        <Field className="flex-1">
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
        <Field className="flex-1">
          <FieldLabel className="text-muted-foreground">Description</FieldLabel>
          <Input type="text" placeholder="Bought a new iPhone" {...register("description")} />
        </Field>
      </FieldGroup>
      <Field>
        <FieldLabel className="text-muted-foreground">
          Category <span className="text-destructive">*</span>
        </FieldLabel>
        <Select onValueChange={(v) => setValue("categoryId", Number(v), { shouldValidate: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose the category" />
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
      <DatePicker
        label="Event date"
        onSelect={(date) => setValue("eventDate", date?.toISOString().split("T")[0] ?? "", { shouldValidate: true })}
      />
      <FieldError>{errors.eventDate?.message}</FieldError>
    </FieldSet>
  )
}
