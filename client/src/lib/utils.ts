import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  })
    .formatToParts(amount / 100)
    .map((part) => (part.type === "currency" ? part.value + "\u00A0" : part.value))
    .join("")
}
