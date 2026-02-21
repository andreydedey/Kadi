import { useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export const AddWalletDialog = () => {
  const currencys = ["cash", "usd", "eur", "real", "btc"]

  const [selectedCurrency, setSelectedCurrency] = useState("")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">Add Wallet</DialogTitle>
          <form action="">
            <FieldGroup>
              <Field>
                <FieldLabel>
                  Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input type="text" placeholder="Bank of America" />
              </Field>
              <Field>
                <FieldLabel>Currency</FieldLabel>
                <Select
                  value={selectedCurrency}
                  onValueChange={setSelectedCurrency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {currencys.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>
                  Balance <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  type="number"
                  placeholder={`0.00 ${selectedCurrency.toUpperCase()}`}
                />
              </Field>
            </FieldGroup>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
