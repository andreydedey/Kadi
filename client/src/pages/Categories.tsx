import { CategoryDialog } from "@/components/CategoryDialog"
import { ProgressWithLabel } from "@/components/ProgressWithLabel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { faBook, faCar, faPizzaSlice } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Categories = () => {
  const categories = [
    { name: "Food", spent: 40, total: 100, icon: faPizzaSlice },
    { name: "Travel", spent: 20, total: 200, icon: faCar },
    { name: "Education", spent: 80, total: 130, icon: faBook },
  ]

  return (
    <>
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-medium">Categories</h1>
        <CategoryDialog />
      </div>
      <Card className="mb-8">
        <CardContent className="flex justify-between px-12">
          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground">
              Total Spent (all wallets)
            </span>
            <span className="text-xl font-semibold">1457.21 USD</span>
          </div>

          <div className="w-px h-16 bg-border self-center" />

          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground">
              Total Spent (all wallets)
            </span>
            <span className="text-xl font-semibold">1457.21 USD</span>
          </div>

          <div className="w-px h-16 bg-border self-center" />

          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground">
              Total Limit (all wallets)
            </span>
            <span className="text-xl font-semibold">1980 USD</span>
          </div>
        </CardContent>
      </Card>
      <Table className="[&_td]:border-0 [&_th]:border-0 [&_tr]:border-0 border-separate border-spacing-y-4 [&_thead_tr]:hover:bg-transparent [&_tbody_tr]:hover:bg-card">
        <TableHeader>
          <TableRow className="text-lg border-0">
            <TableHead className="text-muted-foreground px-8 py-4">
              Category
            </TableHead>
            <TableHead className="text-muted-foreground px-8 py-4">
              Expense Progress
            </TableHead>
            <TableHead className="text-muted-foreground px-8 py-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow className="bg-card">
              <TableCell className="space-x-4 text-lg px-8 py-6 rounded-l-xl">
                <FontAwesomeIcon icon={category.icon} />
                <span>{category.name}</span>
              </TableCell>
              <TableCell className="w-2/3 px-8 py-6">
                <ProgressWithLabel
                  category={category.name}
                  total={category.total}
                  spent={category.spent}
                  currency={"USD"}
                />
              </TableCell>
              <TableCell className="space-x-4 px-8 py-6 rounded-r-xl">
                <CategoryDialog isEditing />
                <Button variant={"destructive"} size={"lg"}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
