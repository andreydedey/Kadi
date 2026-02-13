import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card, CardContent, CardDescription } from "./ui/card"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical"
import type { IconProp } from "@fortawesome/fontawesome-svg-core"

interface ItemCardProps {
  amount: number
  category: string
  icon: IconProp
}

export const ItemCard: React.FC<ItemCardProps> = ({
  amount,
  category,
  icon,
}) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex rounded-full h-8 aspect-square items-center justify-center bg-zinc-800">
            <FontAwesomeIcon className="text-xs" icon={icon} />
          </div>
          <div className="flex flex-col">
            <strong className="text-green-400">+{amount} USD</strong>
            <CardDescription>{category}</CardDescription>
          </div>
        </div>
        <FontAwesomeIcon className="cursor-pointer" icon={faEllipsisVertical} />
      </CardContent>
    </Card>
  )
}
