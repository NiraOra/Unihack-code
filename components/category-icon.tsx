import { Film, Music, Utensils, Plane, Tent } from "lucide-react"

interface CategoryIconProps {
  category: string
  className?: string
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const getIcon = () => {
    switch (category) {
      case "movie":
        return <Film className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      case "party":
        return <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      case "food":
        return <Utensils className="h-6 w-6 text-orange-600 dark:text-orange-400" />
      case "travel":
        return <Plane className="h-6 w-6 text-amber-600 dark:text-amber-400" />
      case "picnic":
        return <Tent className="h-6 w-6 text-green-600 dark:text-green-400" />
      default:
        return <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
    }
  }

  return getIcon()
}

