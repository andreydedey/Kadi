import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { TransactionTab } from "./tabs/TransactionTab"
import { TransferTab } from "./tabs/TransferTab"

const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const AddTransactionDialog = () => {
  const tabs = ["expense", "income", "transfer"]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="min-h-[600px] flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="expense">
          <TabsList className="w-full bg-black border-2 py-6 rounded-lg justify-between">
            {tabs.map((tab) => (
              <TabsTrigger className="p-5 border-0" value={tab}>
                {capitalize(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="expense">
            <TransactionTab isExpense />
          </TabsContent>
          <TabsContent value="income">
            <TransactionTab />
          </TabsContent>
          <TabsContent value="transfer">
            <TransferTab />
          </TabsContent>
        </Tabs>
        <Button className="w-full mt-auto">Save</Button>
      </DialogContent>
    </Dialog>
  )
}
