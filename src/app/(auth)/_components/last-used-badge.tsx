"use client"

import { Badge } from "@/components/ui/badge"

export function LastUsedBadge({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <Badge variant="secondary" className="absolute -top-3 -right-5 w-min! bg-blue-500 text-white dark:bg-blue-600">
      Last used
    </Badge>
  )
}
