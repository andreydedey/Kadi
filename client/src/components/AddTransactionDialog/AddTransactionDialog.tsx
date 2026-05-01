import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { TransactionTab } from "./tabs/TransactionTab"
import { TransferTab } from "./tabs/TransferTab"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  transactionSchema,
  transferSchema,
  type TransactionSchema,
  type TransferSchema,
} from "@/lib/schemas/transactionSchema"
import { useMutation } from "@tanstack/react-query"
import { createTransaction, updateTransaction } from "@/services/transaction"
import { useParams } from "react-router"
import { toast } from "sonner"
import axios from "axios"
import type { TransactionDetail } from "@/lib/types/transaction"

type TabValue = "expense" | "income" | "transfer"

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

interface AddTransactionDialogProps {
  onSuccess?: () => void
  editing?: TransactionDetail
  open?: boolean
  onClose?: () => void
}

interface AddTransactionContentProps {
  onSuccess?: () => void
  onClose: () => void
  editing?: TransactionDetail
}

const AddTransactionContent = ({ onSuccess, onClose, editing }: AddTransactionContentProps) => {
  const isEditing = !!editing
  const editingTab = editing
    ? (editing.type.toLowerCase() as TabValue)
    : undefined
  const [activeTab, setActiveTab] = useState<TabValue>(editingTab ?? "expense")
  const { id: walletId } = useParams<{ id: string }>()

  const transactionForm = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: editing && editing.type !== "TRANSFER"
      ? {
          amount: editing.amount,
          categoryId: editing.categoryId ?? undefined,
          description: editing.description ?? undefined,
          eventDate: editing.eventDate,
        }
      : undefined,
  })

  const transferForm = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema),
    defaultValues: editing?.type === "TRANSFER"
      ? {
          amount: editing.amount,
          destinationWalletId: editing.destinationWalletId ?? undefined,
          destinationAmount: editing.destinationAmount ?? undefined,
          description: editing.description ?? undefined,
          eventDate: editing.eventDate,
        }
      : undefined,
  })

  const { mutate: saveTransaction, isPending } = useMutation({
    mutationFn: (data: TransactionSchema | TransferSchema) => {
      if (activeTab === "transfer") {
        const transferData = data as TransferSchema
        const body = {
          type: "TRANSFER" as const,
          amount: transferData.amount,
          destinationWalletId: transferData.destinationWalletId,
          destinationAmount: transferData.destinationAmount,
          description: transferData.description,
          eventDate: transferData.eventDate,
        }
        return isEditing
          ? updateTransaction(walletId!, editing!.id, body)
          : createTransaction(walletId!, body)
      }
      const transactionData = data as TransactionSchema
      const body = {
        type: activeTab === "expense" ? "EXPENSE" as const : "INCOME" as const,
        amount: transactionData.amount,
        categoryId: transactionData.categoryId,
        description: transactionData.description,
        eventDate: transactionData.eventDate,
      }
      return isEditing
        ? updateTransaction(walletId!, editing!.id, body)
        : createTransaction(walletId!, body)
    },
    onSuccess: () => {
      toast.success(isEditing ? "Transaction updated" : "Transaction saved")
      onSuccess?.()
      onClose()
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to save transaction")
        : "Failed to save transaction"
      toast.error(message)
    },
  })

  const tabs: TabValue[] = ["expense", "income", "transfer"]

  return (
    <form
      className="flex flex-col flex-1 gap-6"
      onSubmit={
        activeTab === "transfer"
          ? transferForm.handleSubmit((data) => saveTransaction(data))
          : transactionForm.handleSubmit((data) => saveTransaction(data))
      }
    >
      {isEditing ? (
        <>
          {activeTab === "transfer" ? (
            <TransferTab form={transferForm} defaultValues={transferForm.getValues()} />
          ) : (
            <TransactionTab form={transactionForm} defaultValues={transactionForm.getValues()} />
          )}
        </>
      ) : (
        <Tabs defaultValue="expense" onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList className="w-full bg-black border-2 py-6 rounded-lg justify-between">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} className="p-5 border-0" value={tab}>
                {capitalize(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="expense">
            <TransactionTab isExpense form={transactionForm} />
          </TabsContent>
          <TabsContent value="income">
            <TransactionTab form={transactionForm} />
          </TabsContent>
          <TabsContent value="transfer">
            <TransferTab form={transferForm} />
          </TabsContent>
        </Tabs>
      )}
      <Button className="w-full mt-auto" type="submit" disabled={isPending}>
        Save
      </Button>
    </form>
  )
}

export const AddTransactionDialog = ({ onSuccess, editing, open: controlledOpen, onClose: controlledOnClose }: AddTransactionDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const handleClose = () => {
    isControlled ? controlledOnClose?.() : setInternalOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      {!isControlled && (
        <Button onClick={() => setInternalOpen(true)}>Add Transaction</Button>
      )}
      {open && (
        <DialogContent className="min-h-[600px] flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          </DialogHeader>
          <AddTransactionContent onSuccess={onSuccess} onClose={handleClose} editing={editing} />
        </DialogContent>
      )}
    </Dialog>
  )
}
