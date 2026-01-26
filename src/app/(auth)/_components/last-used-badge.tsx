"use client"

import { Badge } from "@/components/ui/badge"

export function LastUsedBadge({ show, isSocial }: { show: boolean; isSocial?: boolean }) {
  if (!show) return null

  return (
    <Badge variant={isSocial ? "default" : "secondary"} className="absolute -top-2.5 -right-5 w-min!">
      Last used
    </Badge>
  )
}
