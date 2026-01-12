"use client"

import { Search } from "lucide-react"

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex h-10 w-full items-center border-b">
      <Search className="mx-3 size-4 text-muted-foreground" />
      <input
        className="h-full w-full flex-1 pr-2.5 text-sm outline-none"
        placeholder="Search models..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
