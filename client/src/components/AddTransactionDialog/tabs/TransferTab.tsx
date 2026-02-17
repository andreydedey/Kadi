import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
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

export const TransferTab = () => {
  const wallets = ["inter", "cash"]

  return (
    <>
      <FieldSet className="grid grid-cols-10 mt-2 mb-6">
        <Field className="col-span-4">
          <FieldLabel className="text-muted-foreground">From</FieldLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose the wallet" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <FontAwesomeIcon
          className="col-span-2 self-end justify-self-center mb-2"
          icon={faArrowRight}
        />
        <Field className="col-span-4">
          <FieldLabel className="text-muted-foreground">To</FieldLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose the wallet" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet} value={wallet}>
                    {wallet}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field className="col-span-4">
          <FieldLabel className="text-muted-foreground">
            Amount <span className="text-destructive">*</span>
          </FieldLabel>
          <Input type="number" placeholder="0.00" />
        </Field>
        <div className="col-span-2" />
        <Field className="col-span-4">
          <FieldLabel className="text-muted-foreground">
            Amount <span className="text-destructive">*</span>
          </FieldLabel>
          <Input type="number" placeholder="0.00" />
        </Field>
        <Field className="col-span-10">
          <FieldLabel className="text-muted-foreground">Description</FieldLabel>
          <Input type="text" placeholder="Just saved some money" />
        </Field>
        <DatePicker label="Event date" className="col-span-10" />
      </FieldSet>
      <Button className="w-full">Save</Button>
    </>
  )
}
