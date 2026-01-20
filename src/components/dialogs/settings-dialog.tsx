"use client"

import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { DialogContent, DialogTitle } from "@/components/ui/dialog"

export function SettingsDialog() {
  return (
    <DialogContent showCloseButton={false}>
      <VisuallyHidden>
        <DialogTitle>Settings</DialogTitle>
      </VisuallyHidden>
    </DialogContent>
  )
}
