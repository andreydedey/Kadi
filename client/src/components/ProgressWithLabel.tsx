import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"

interface ProgressWithLabelProps {
  category: string
  progress: number
}

export const ProgressWithLabel: React.FC<ProgressWithLabelProps> = ({
  category,
  progress,
}) => {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="progress-upload">
        <span>{category}</span>
        <span className="ml-auto">{progress}%</span>
      </FieldLabel>
      <Progress value={66} id="progress-upload" />
    </Field>
  )
}
