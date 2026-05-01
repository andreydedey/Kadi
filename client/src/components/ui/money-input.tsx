import { useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./input-group"

interface MoneyInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "type" | "defaultValue"> {
  onChange?: (cents: number) => void
  defaultValue?: number
}

export function MoneyInput({ onChange, defaultValue, ...props }: MoneyInputProps) {
  const [digits, setDigits] = useState(defaultValue ? String(defaultValue) : "")

  const display = digits
    ? (parseInt(digits, 10) / 100).toFixed(2)
    : ""

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, "")
    setDigits(onlyDigits)
    onChange?.(parseInt(onlyDigits, 10) || 0)
  }

  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        placeholder="0.00"
        {...props}
      />
    </InputGroup>
  )
}
