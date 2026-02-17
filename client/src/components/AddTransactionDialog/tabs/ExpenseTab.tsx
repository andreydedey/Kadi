import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
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
import { Button } from "@/components/ui/button"

export const ExpenseTab = () => {
  const categories = ["food", "work", "leisure"]

  return (
    <>
      <FieldSet className="flex-1 flex flex-col gap-4 mt-2 mb-6">
        <FieldGroup className="flex flex-row">
          <Field className="flex-1">
            <FieldLabel className="text-muted-foreground">
              Amount <span className="text-destructive">*</span>
            </FieldLabel>
            <Input type="number" placeholder="0.00 USD" />
          </Field>
          <Field className="flex-1">
            <FieldLabel className="text-muted-foreground">
              Description
            </FieldLabel>
            <Input type="text" placeholder="Bought a new iPhone" />
          </Field>
        </FieldGroup>
        <Field className="col-span-4">
          <FieldLabel className="text-muted-foreground">
            Category <span className="text-destructive">*</span>
          </FieldLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose the category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((categorie) => (
                  <SelectItem key={categorie} value={categorie}>
                    {categorie}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <DatePicker label="Event date" className="col-span-10" />
      </FieldSet>
      <Button className="w-full">Save</Button>
    </>
  )
}
