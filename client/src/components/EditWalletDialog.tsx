import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group"

export const EditWalletDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          className="cursor-pointer hover:bg-accent-foreground"
          variant={"ghost"}
          size={"icon"}
        >
          <FontAwesomeIcon className="text-lg" icon={faEdit} />
        </Button>
      </DialogTrigger>
      <DialogContent notDismissible>
        <DialogHeader>
          <DialogTitle>Edit Wallet Information</DialogTitle>
        </DialogHeader>
        <form action="">
          <Field>
            <FieldLabel>
              Wallet name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input type="text" placeholder="Savings" />
            <FieldLabel className="text-muted-foreground">
              Currency (cannot be changed)
            </FieldLabel>
            <Input type="text" placeholder="USD - US Dollar" disabled />
          </Field>
          <FieldGroup className="flex flex-row gap-6 mt-3">
            <Field>
              <FieldLabel>Salary day</FieldLabel>
              <InputGroup>
                <InputGroupInput placeholder="12" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>day of month</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <span className="text-muted-foreground text-xs">
                Beetween 1 and 31
              </span>
            </Field>
            <Field>
              <FieldLabel>Expected monthly income</FieldLabel>
              <Input type="number" placeholder="104.12 USD" />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter className="w-full *:flex-1 mt-4">
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
