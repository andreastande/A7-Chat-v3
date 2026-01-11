"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  hasBridge = false,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & { hasBridge?: boolean }) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        style={hasBridge ? { "--bridge-size": `${sideOffset}px` } as React.CSSProperties : undefined}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          hasBridge &&
            "before:absolute before:top-0 before:h-full before:w-(--bridge-size) before:content-[''] data-[side=right]:before:-left-(--bridge-size) data-[side=left]:before:-right-(--bridge-size) data-[side=top]:before:-bottom-(--bridge-size) data-[side=top]:before:left-0 data-[side=top]:before:h-(--bridge-size) data-[side=top]:before:w-full data-[side=bottom]:before:-top-(--bridge-size) data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-(--bridge-size) data-[side=bottom]:before:w-full",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
