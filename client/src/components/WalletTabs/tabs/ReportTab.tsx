import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import { getTransactionsSummary } from "@/services/transaction"
import { useParams } from "react-router"
import { useWallet } from "@/contexts/WalletContext"
import { formatMoney } from "@/lib/utils"
import type { WeeklyTransactionSummary } from "@/lib/types/transaction"

const WeekCard = ({ week }: { week: WeeklyTransactionSummary }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { currency } = useWallet()

  return (
    <Card>
      <CardContent className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl text-muted-foreground">{week.weekLabel}</h2>
          <div className="flex gap-8 mr-12">
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Total Income</h3>
              <h3 className="text-xl">
                {formatMoney(week.totalIncome, currency)}
              </h3>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Total Expense</h3>
              <h3 className="text-xl">
                {formatMoney(week.totalExpense, currency)}
              </h3>
            </div>
          </div>
        </div>
        <Collapsible className="space-y-4" onOpenChange={setIsOpen}>
          <CollapsibleContent className="space-y-6">
            <hr />
            {week.expenseCategories.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-2xl text-muted-foreground">Expenses</h4>
                <div className="grid grid-cols-3 gap-y-2">
                  <h4 className="text-muted-foreground">Category</h4>
                  <h4 className="text-muted-foreground">Percentage</h4>
                  <h4 className="text-muted-foreground">Amount</h4>
                  {week.expenseCategories.map((cat) => (
                    <>
                      <h4 key={`exp-name-${cat.categoryId}`}>
                        {cat.categoryName}
                      </h4>
                      <h4 key={`exp-pct-${cat.categoryId}`}>
                        {cat.percentage.toFixed(1)}%
                      </h4>
                      <h4 key={`exp-amt-${cat.categoryId}`}>
                        {formatMoney(cat.amount, currency)}
                      </h4>
                    </>
                  ))}
                </div>
              </div>
            )}
            {week.incomeCategories.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-2xl text-muted-foreground">Income</h4>
                <div className="grid grid-cols-3 gap-y-2">
                  <h4 className="text-muted-foreground">Category</h4>
                  <h4 className="text-muted-foreground">Percentage</h4>
                  <h4 className="text-muted-foreground">Amount</h4>
                  {week.incomeCategories.map((cat) => (
                    <>
                      <h4 key={`inc-name-${cat.categoryId}`}>
                        {cat.categoryName}
                      </h4>
                      <h4 key={`inc-pct-${cat.categoryId}`}>
                        {cat.percentage.toFixed(1)}%
                      </h4>
                      <h4 key={`inc-amt-${cat.categoryId}`}>
                        {formatMoney(cat.amount, currency)}
                      </h4>
                    </>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button variant="secondary" className="w-full">
              {isOpen ? "Less details" : "More details"}
              <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

export const ReportTab = () => {
  const { id: walletId } = useParams<{ id: string }>()

  const { data: weeks = [] } = useQuery({
    queryKey: ["wallets", walletId, "transactions", "summary"],
    queryFn: () => getTransactionsSummary(walletId!),
  })

  return (
    <div className="space-y-4">
      {weeks.map((week) => (
        <WeekCard key={week.weekLabel} week={week} />
      ))}
      {weeks.length === 0 && (
        <p className="text-muted-foreground text-sm text-center">
          No transactions yet.
        </p>
      )}
    </div>
  )
}
