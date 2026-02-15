import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export const DialogTab = () => {
  return (
    <Tabs defaultValue="expense">
      <TabsList>
        <TabsTrigger value="expense">Expense</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
        <TabsTrigger value="transfer">Transfer</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}
