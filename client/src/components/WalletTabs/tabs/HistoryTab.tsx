import { AddTransactionDialog } from "@/components/AddTransactionDialog/AddTransactionDialog"
import { ItemCard } from "@/components/ItemCard"
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons/faPizzaSlice"

export const HistoryTab = () => {
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-md">Transactions</h2>
        <AddTransactionDialog />
      </div>
      <div className="space-y-4">
        <h3 className="text-sm text-muted-foreground antialiased">
          Jan 1, 2024
        </h3>
        <ItemCard amount={40} category="Food" icon={faPizzaSlice} />
      </div>
    </>
  )
}
