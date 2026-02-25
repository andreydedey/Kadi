import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog"
import { Field, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"

export const AddSubscriptionDialog = () => {
  const categories = ["Food", "Travel", "Entertainment"]
  const [selectedCategory, setSelectetCategory] = useState("")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="bg-transparent! border-0 p-0! text-muted-foreground text-md"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Add Subscription</DialogHeader>
        <Field>
          <FieldLabel>
            Description <span className="text-destructive">*</span>
          </FieldLabel>
          <Input type="text" placeholder="Travel" />
        </Field>
        <Field>
          <FieldLabel>
            Category <span className="text-destructive">*</span>
          </FieldLabel>
          <Select value={selectedCategory} onValueChange={setSelectetCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.toUpperCase()}
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
