import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { Field, FieldLabel } from "./ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useState } from "react"
import { Input } from "./ui/input"

export const AddCategoryLimitDialog = () => {
  const categories = ["Food", "Entertainment", "Travel"]
  const [selectedCategory, setSelectedCategory] = useState("")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Add Limits by Category</DialogHeader>
        <Field>
          <FieldLabel>
            Currency <span className="text-destructive">*</span>
          </FieldLabel>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>
            Amount <span className="text-destructive">*</span>
          </FieldLabel>
          <Input type="number" placeholder="0.00 USD" />
        </Field>
        <Button className="mt-4">Save</Button>
      </DialogContent>
    </Dialog>
  )
}
