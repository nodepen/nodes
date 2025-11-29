import type React from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '$'

type DialogPortalProps = {
  children: React.ReactNode
}

export const DialogPortal = ({ children }: DialogPortalProps) => {
  const dialogContainerRef = useStore((state) => state.registry.dialogRoot)

  if (!dialogContainerRef || !dialogContainerRef.current) {
    return null
  }

  return createPortal(children, dialogContainerRef.current)
}
