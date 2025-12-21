"use client"

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import type { ComponentProps } from "react"
import { useHotkeys } from "react-hotkeys-hook"

function ThemeToggleHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  useHotkeys("shift+mod+d", () => setTheme(resolvedTheme === "dark" ? "light" : "dark"), {
    preventDefault: true,
    enableOnFormTags: true,
  })

  return null
}

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeToggleHotkey />
      {children}
    </NextThemesProvider>
  )
}
