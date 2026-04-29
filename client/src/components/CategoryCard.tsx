import { ProgressWithLabel } from "./ProgressWithLabel"
import { formatMoney } from "@/lib/utils"
import type { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faAngleUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "./ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { Card, CardContent } from "./ui/card"
import { RemoveCategoryLimitDialog } from "./RemoveCategoryLimitDialog"
import { CategoryLimitDialog } from "./CategoryLimitDialog"
import { useWallet } from "@/contexts/WalletContext"

interface CategoryCardProps {
  id: number
  category: string
  icon: IconProp
  spendingLimit: number
  spent: number
  onSuccess?: () => void
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  category,
  icon,
  spendingLimit,
  spent,
  onSuccess,
}) => {
  const { currency } = useWallet()

  return (
    <Collapsible className="data-[state=open]:bg-mutedfocus-visible:ring-0 focus-visible:bg-transparent hover:bg-transparent space-y-6">
      <div className="flex gap-3 items-center">
        <div className="flex rounded-full h-12 aspect-square items-center justify-center bg-zinc-800">
          <FontAwesomeIcon icon={icon} />
        </div>
        <ProgressWithLabel
          category={category}
          spent={spent}
          total={spendingLimit}
          currency={currency}
        />
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="group">
            <FontAwesomeIcon
              className="text-md text-muted-foreground font-light transition-transform duration-200 group-data-[state=open]:rotate-180"
              icon={faAngleUp}
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Card className="border-0 bg-background-secondary mb-3">
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your total limit is{" "}
              <span className="font-medium text-white">
                {formatMoney(spendingLimit, currency)}
              </span>
              <br />
              Spent{" "}
              <span className="font-medium text-white">
                {formatMoney(spent, currency)}
              </span>{" "}
              already
            </p>
            <div className="flex gap-3">
              <CategoryLimitDialog
                editing={{
                  id,
                  categoryId: id,
                  categoryName: category,
                  spendingLimit,
                }}
                onSuccess={onSuccess}
              />
              <RemoveCategoryLimitDialog
                id={id}
                category={category}
                onSuccess={onSuccess}
              />
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
