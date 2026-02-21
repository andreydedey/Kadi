import { ProgressWithLabel } from "./ProgressWithLabel"
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

interface CategoryCardProps {
  category: string
  icon: IconProp
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  icon,
}) => {
  return (
    <Collapsible className="data-[state=open]:bg-mutedfocus-visible:ring-0 focus-visible:bg-transparent hover:bg-transparent space-y-6">
      <div className="flex gap-3 items-center">
        <div className="flex rounded-full h-12 aspect-square items-center justify-center bg-zinc-800">
          <FontAwesomeIcon icon={icon} />
        </div>
        <ProgressWithLabel category={category} left={66} />
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
        <Card className="border-0 bg-background-secondary">
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your total limit is{" "}
              <span className="font-medium text-white">940 USD</span>
              <br />
              Spent <span className="font-medium text-white">76.90 USD</span>{" "}
              already
              <br />
              Spend less than{" "}
              <span className="font-mediu text-white">66.39 USD</span> per day
            </p>
            <div className="flex gap-3">
              <Button className="w-24" variant="secondary">
                Edit
              </Button>
              <Button className="w-24" variant="destructive">
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
