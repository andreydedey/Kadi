import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"

interface ProgressWithLabelProps {
  category: string
  left: number
}

export const ProgressWithLabel: React.FC<ProgressWithLabelProps> = ({
  category,
  left,
}) => {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="progress-upload">
        <span>{category}</span>
        <div className="ml-auto flex gap-2">
          <span className="font-medium">3553.00 USD</span>
          <span className="text-muted-foreground">left</span>
        </div>
      </FieldLabel>
      <Progress value={66} id="progress-upload" />
    </Field>
  )
}
