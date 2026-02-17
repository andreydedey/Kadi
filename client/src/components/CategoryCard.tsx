import { ProgressWithLabel } from "./ProgressWithLabel"
import type { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faAngleUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface CategoryCardProps {
  category: string
  icon: IconProp
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  icon,
}) => {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex rounded-full h-12 aspect-square items-center justify-center bg-zinc-800">
        <FontAwesomeIcon icon={icon} />
      </div>
      <ProgressWithLabel category={category} left={66} />
      <FontAwesomeIcon
        className="text-md ml-2 text-muted-foreground font-light"
        icon={faAngleUp}
      />
    </div>
  )
}
