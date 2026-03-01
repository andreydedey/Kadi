import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  faChevronDown,
  faChevronUp,
  faGamepad,
  faPizzaSlice,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ReportTab = () => {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    { title: "food", percentage: 50, spent: 45, icon: faPizzaSlice },
    { title: "entertainement", percentage: 50, spent: 45, icon: faGamepad },
  ]

  return (
    <Card>
      <CardContent className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl text-muted-foreground">Jan 1 - Jan 7</h2>
          <div className="flex gap-8 mr-12">
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Total Income</h3>
              <h3 className="text-xl">640 USD</h3>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Total Expense</h3>
              <h3 className="text-xl">210 USD</h3>
            </div>
          </div>
        </div>
        <Collapsible className="space-y-4" onOpenChange={setIsOpen}>
          <CollapsibleContent className="grid grid-cols-3 gap-y-3">
            <hr className="col-span-3 mb-2" />
            <h4 className="text-muted-foreground">Category</h4>
            <h4 className="text-muted-foreground">Percentage</h4>
            <h4 className="text-muted-foreground">Spent</h4>
            {categories.map((category) => (
              <>
                <h4 className="flex gap-3 items-center">
                  <FontAwesomeIcon icon={category.icon} />
                  {category.title}
                </h4>
                <h4>{category.percentage}%</h4>
                <h4>{category.spent} USD</h4>
              </>
            ))}
            <div className="mt-3 space-y-1">
              <h3 className="text-muted-foreground">Transfers Received</h3>
              <h3 className="text-xl">10 USD</h3>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-muted-foreground">Transfers Sent</h3>
              <h3 className="text-xl">40 USD</h3>
            </div>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button variant={"secondary"} className="w-full">
              {isOpen ? "Less details" : "More details"}
              <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
