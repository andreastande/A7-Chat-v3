import { useEffect, type RefObject } from "react"

export function useFocusOnType(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  setInput: (updater: (prev: string) => string) => void,
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const textarea = textareaRef.current
      if (!textarea || document.activeElement === textarea) return

      if (e.ctrlKey || e.metaKey) return // Ignore modifier key combos (Ctrl/Cmd shortcuts)
      if (e.key.length !== 1) return // Only handle printable characters
      if (e.key === " ") return // Space scrolls the page

      // Don't intercept if user is typing in another input
      const activeEl = document.activeElement
      if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement) return

      e.preventDefault() // Prevent duplicate input after focus
      setInput((prev) => prev + e.key)
      textarea.focus()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, []) // oxlint-disable-line
}
