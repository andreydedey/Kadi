import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog"
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"

export const CategoryDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">Add Category</DialogHeader>
        <Field>
          <FieldLabel>
            Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input type="text" placeholder="e.g. Food, Travel, Health..." />
        </Field>
        <FieldGroup className="flex flex-row">
          <Field>
            <FieldLabel>Spending limit </FieldLabel>
            <Input type="number" placeholder="150.00 USD" />
          </Field>
          <Field className="w-32">
            <FieldLabel>Icon </FieldLabel>
            <Input type="text" />
          </Field>
        </FieldGroup>
        <Button className="mt-4">Save</Button>
      </DialogContent>
    </Dialog>
  )
}
