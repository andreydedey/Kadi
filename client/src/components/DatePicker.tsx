"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { useState } from "react"

interface DatePickerProps {
  id?: string
  className?: string
  placeholder?: string
  label: string
  onSelect?: (date: Date | undefined) => void
}

export function DatePicker({
  id,
  className,
  placeholder = "Pick a date",
  label,
  onSelect,
}: DatePickerProps) {
  const [date, setDate] = useState<Date>()

  const handleSelect = (date: Date | undefined) => {
    setDate(date)
    onSelect?.(date)
  }

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="justify-start font-normal !bg-black"
          >
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
