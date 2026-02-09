"use client"

import { type DragEvent, useRef, useState } from "react"

interface UseFileDragDropOptions {
  onFilesDrop: (files: File[]) => void
}

function hasDraggedFiles(event: DragEvent<HTMLElement>) {
  return Array.from(event.dataTransfer?.types ?? []).includes("Files")
}

export function useFileDragDrop({ onFilesDrop }: UseFileDragDropOptions) {
  const [isDragActive, setIsDragActive] = useState(false)
  const dragDepthRef = useRef(0)

  function handleDragEnter(event: DragEvent<HTMLElement>) {
    if (!hasDraggedFiles(event)) return
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDragActive(true)
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    if (!hasDraggedFiles(event)) return
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) {
      setIsDragActive(false)
    }
  }

  function handleDragOver(event: DragEvent<HTMLElement>) {
    if (!hasDraggedFiles(event)) return
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    if (!hasDraggedFiles(event)) return
    event.preventDefault()

    dragDepthRef.current = 0
    setIsDragActive(false)
    onFilesDrop(Array.from(event.dataTransfer.files))
  }

  return {
    isDragActive,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  }
}
