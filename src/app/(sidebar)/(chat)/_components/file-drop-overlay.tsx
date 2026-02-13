"use client"

import { FileUp } from "lucide-react"

export function FileDropOverlay() {
  return (
    <div className="pointer-events-none absolute inset-8 z-50 grid place-items-center rounded-2xl border-2 border-dashed border-primary/50 bg-primary/10 backdrop-blur-[1px]">
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm shadow-sm">
        <FileUp className="size-4 text-primary" />
        Drop files to attach
      </div>
    </div>
  )
}
