import { Badge } from "@/components/ui/badge"

interface LastUsedBadgeProps {
  show: boolean
}

export function LastUsedBadge({ show }: LastUsedBadgeProps) {
  if (!show) return null

  return (
    <Badge variant="secondary" className="-top-3 -right-5 absolute w-min! bg-blue-500 text-white dark:bg-blue-600">
      Last used
    </Badge>
  )
}
