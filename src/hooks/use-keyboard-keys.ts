"use client"

import { useEffect, useState } from "react"

function isMac() {
  if (typeof window === "undefined") return false
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
}

export function useKeyboardKeys() {
  const [keys, setKeys] = useState<{ mod: "⌘" | "Ctrl+"; shift: "⇧" | "Shift+" }>({
    mod: "Ctrl+",
    shift: "Shift+",
  })

  useEffect(() => {
    setKeys(isMac() ? { mod: "⌘", shift: "⇧" } : { mod: "Ctrl+", shift: "Shift+" })
  }, [])

  return keys
}
