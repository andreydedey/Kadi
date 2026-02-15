import { FieldGroup } from "./ui/field"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

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
      <DialogContent className="min-h-[500px] flex flex-col gap-6">
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
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="expense">
            <FieldGroup>andrey</FieldGroup>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
