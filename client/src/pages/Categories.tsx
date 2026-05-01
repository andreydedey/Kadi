import { CategoryDialog } from "@/components/CategoryDialog"
import { DeleteCategoryDialog } from "@/components/DeleteCategoryDialog"
import { ProgressWithLabel } from "@/components/ProgressWithLabel"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import { getCategoriesDetail } from "@/services/category"
import { formatMoney } from "@/lib/utils"

const DISPLAY_CURRENCY = "USD"

export const Categories = () => {
  const { data: categories = [], refetch } = useQuery({
    queryKey: ["categories", "detail"],
    queryFn: getCategoriesDetail,
  })

  const totalSpent = categories.reduce((sum, cat) => sum + cat.globalSpent, 0)
  const totalLimit = categories.reduce((sum, cat) => sum + (cat.globalLimit ?? 0), 0)

  return (
    <>
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-medium">Categories</h1>
        <CategoryDialog onSuccess={refetch} />
      </div>
      <Card className="mb-8">
        <CardContent className="flex justify-between px-12">
          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground">Total Spent (all wallets)</span>
            <span className="text-xl font-semibold">{formatMoney(totalSpent, DISPLAY_CURRENCY)}</span>
          </div>
          <div className="w-px h-16 bg-border self-center" />
          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground">Total Limit (all wallets)</span>
            <span className="text-xl font-semibold">{formatMoney(totalLimit, DISPLAY_CURRENCY)}</span>
          </div>
        </CardContent>
      </Card>
      <Table className="[&_td]:border-0 [&_th]:border-0 [&_tr]:border-0 border-separate border-spacing-y-4 [&_thead_tr]:hover:bg-transparent [&_tbody_tr]:hover:bg-card">
        <TableHeader>
          <TableRow className="text-lg border-0">
            <TableHead className="text-muted-foreground px-8 py-4">Category</TableHead>
            <TableHead className="text-muted-foreground px-8 py-4">Expense Progress</TableHead>
            <TableHead className="text-muted-foreground px-8 py-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="bg-card">
              <TableCell className="space-x-4 text-lg px-8 py-6 rounded-l-xl">
                <FontAwesomeIcon icon={faPizzaSlice} />
                <span>{category.name}</span>
              </TableCell>
              <TableCell className="w-2/3 px-8 py-6">
                {category.globalLimit != null ? (
                  <ProgressWithLabel
                    category={category.name}
                    total={category.globalLimit}
                    spent={category.globalSpent}
                    currency={DISPLAY_CURRENCY}
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">No limit set</span>
                )}
              </TableCell>
              <TableCell className="space-x-4 px-8 py-6 rounded-r-xl">
                {!category.isStandard && (
                  <>
                    <CategoryDialog editing={category} onSuccess={refetch} />
                    <DeleteCategoryDialog id={category.id} name={category.name} onSuccess={refetch} />
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
