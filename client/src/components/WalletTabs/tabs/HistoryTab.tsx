import { AddTransactionDialog } from "@/components/AddTransactionDialog/AddTransactionDialog"
import { ItemCard } from "@/components/ItemCard"
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons/faPizzaSlice"
import { useQuery } from "@tanstack/react-query"
import { getTransactions } from "@/services/transaction"
import { getWallet } from "@/services/wallet"
import { useParams } from "react-router"
import { format } from "date-fns"

export const HistoryTab = () => {
  const { id: walletId } = useParams<{ id: string }>()

  const { data: transactions = [], refetch } = useQuery({
    queryKey: ["wallets", walletId, "transactions"],
    queryFn: () => getTransactions(walletId!),
  })

  const grouped = transactions.reduce<Record<string, typeof transactions>>((acc, transaction) => {
    const key = format(new Date(transaction.eventDate), "MMM d, yyyy")
    acc[key] = [...(acc[key] ?? []), transaction]
    return acc
  }, {})

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-md">Transactions</h2>
        <AddTransactionDialog onSuccess={refetch} />
      </div>
      <div className="space-y-4">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="space-y-2">
            <h3 className="text-sm text-muted-foreground antialiased">{date}</h3>
            {items.map((transaction) => (
              <ItemCard
                key={transaction.id}
                amount={transaction.amount}
                category={transaction.categoryName ?? transaction.type}
                icon={faPizzaSlice}
                type={transaction.type}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
