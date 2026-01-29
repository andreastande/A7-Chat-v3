"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { API_KEY_CONFIGS, type ApiKeyProvider } from "@/lib/api-keys"

interface ApiKeyCardProps {
  provider: ApiKeyProvider
  onEdit: () => void
  onDelete: () => void
}

export function ApiKeyCard({ provider, onEdit, onDelete }: ApiKeyCardProps) {
  const config = API_KEY_CONFIGS[provider]

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <div className="font-medium">{config.label}</div>
        <div className="text-muted-foreground text-sm font-mono">{config.placeholder}••••••••</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
