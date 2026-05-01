import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card, CardContent, CardDescription } from "./ui/card"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical"
import type { IconProp } from "@fortawesome/fontawesome-svg-core"
import type { TransactionDetail } from "@/lib/types/transaction"
import { formatMoney } from "@/lib/utils"
import { useWallet } from "@/contexts/WalletContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { AddTransactionDialog } from "./AddTransactionDialog/AddTransactionDialog"
import { DeleteTransactionDialog } from "./DeleteTransactionDialog"
import { useState } from "react"

interface ItemCardProps {
  transaction: TransactionDetail
  icon: IconProp
  onSuccess?: () => void
}

export const ItemCard: React.FC<ItemCardProps> = ({ transaction, icon, onSuccess }) => {
  const { currency } = useWallet()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const isExpense = transaction.type === "EXPENSE"

  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex rounded-full h-8 aspect-square items-center justify-center bg-zinc-800">
              <FontAwesomeIcon className="text-xs" icon={icon} />
            </div>
            <div className="flex flex-col">
              <strong className={isExpense ? "text-destructive" : "text-green-400"}>
                {isExpense ? "-" : "+"}{formatMoney(transaction.amount, currency)}
              </strong>
              <CardDescription>{transaction.categoryName ?? transaction.type}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <FontAwesomeIcon className="cursor-pointer" icon={faEllipsisVertical} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteOpen(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <DeleteTransactionDialog
        transactionId={transaction.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={onSuccess}
      />

      <AddTransactionDialog
        editing={transaction}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  )
}
