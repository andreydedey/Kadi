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
import { createTransaction } from "@/services/transaction"
import { useParams } from "react-router"
import { toast } from "sonner"
import axios from "axios"

type TabValue = "expense" | "income" | "transfer"

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

interface AddTransactionDialogProps {
  onSuccess?: () => void
}

export const AddTransactionDialog = ({ onSuccess }: AddTransactionDialogProps) => {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabValue>("expense")
  const { id: walletId } = useParams<{ id: string }>()

  const transactionForm = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
  })

  const transferForm = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema),
  })

  const { mutate: saveTransaction, isPending } = useMutation({
    mutationFn: (data: TransactionSchema | TransferSchema) => {
      if (activeTab === "transfer") {
        const transferData = data as TransferSchema
        return createTransaction(walletId!, {
          type: "TRANSFER",
          amount: transferData.amount,
          destinationWalletId: transferData.destinationWalletId,
          destinationAmount: transferData.destinationAmount,
          description: transferData.description,
          eventDate: transferData.eventDate,
        })
      }
      const transactionData = data as TransactionSchema
      return createTransaction(walletId!, {
        type: activeTab === "expense" ? "EXPENSE" : "INCOME",
        amount: transactionData.amount,
        categoryId: transactionData.categoryId,
        description: transactionData.description,
        eventDate: transactionData.eventDate,
      })
    },
    onSuccess: () => {
      toast.success("Transaction saved")
      onSuccess?.()
      setOpen(false)
      transactionForm.reset()
      transferForm.reset()
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Add Transaction</Button>
      <DialogContent className="min-h-[600px] flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col flex-1 gap-6"
          onSubmit={
            activeTab === "transfer"
              ? transferForm.handleSubmit((data) => saveTransaction(data))
              : transactionForm.handleSubmit((data) => saveTransaction(data))
          }
        >
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
          <Button className="w-full mt-auto" type="submit" disabled={isPending}>
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
