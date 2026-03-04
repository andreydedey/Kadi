import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"

interface ProgressWithLabelProps {
  category: string
  spent: number
  total: number
}

export const ProgressWithLabel: React.FC<ProgressWithLabelProps> = ({
  category,
  spent,
  total,
}) => {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="progress-upload">
        <span>{category}</span>
        <div className="ml-auto flex gap-2">
          <span className="font-medium">{total - spent} USD</span>
          <span className="text-muted-foreground">left</span>
        </div>
      </FieldLabel>
      <Progress value={(spent * 100) / total} id="progress-upload" />
    </Field>
  )
}
