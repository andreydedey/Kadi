import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addMonths, differenceInDays, setDate, startOfDay } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function daysBeforeSalary(salaryDay: number): string {
  const today = startOfDay(new Date())
  const currentDay = today.getDate()

  const nextSalary = currentDay < salaryDay
    ? setDate(today, salaryDay)
    : setDate(addMonths(today, 1), salaryDay)

  const days = differenceInDays(nextSalary, today)
  return days === 1 ? "1 day" : `${days} days`
}

export function formatMoney(amount: number, currency: NonNullable<Intl.NumberFormatOptions["currency"]>): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  })
    .formatToParts(amount / 100)
    .map((part) => (part.type === "currency" ? part.value + "\u00A0" : part.value))
    .join("")
}
