import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { formatMoney } from "@/lib/utils"

interface ProgressWithLabelProps {
  category: string
  spent: number
  total: number
  currency: NonNullable<Intl.NumberFormatOptions["currency"]>
}

export const ProgressWithLabel: React.FC<ProgressWithLabelProps> = ({
  category,
  spent,
  total,
  currency,
}) => {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="progress-upload">
        <span>{category}</span>
        <div className="ml-auto flex gap-2">
          <span className="font-medium">{formatMoney(total - spent, currency)}</span>
          <span className="text-muted-foreground">left</span>
        </div>
      </FieldLabel>
      <Progress value={(spent * 100) / total} id="progress-upload" />
    </Field>
  )
}
