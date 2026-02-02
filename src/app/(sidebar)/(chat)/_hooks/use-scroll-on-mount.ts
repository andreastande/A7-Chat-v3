import { useEffect } from "react"

export function useScrollOnMount() {
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" })
  }, [])
}
