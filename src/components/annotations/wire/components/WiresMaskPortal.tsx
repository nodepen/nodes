import type React from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '$'

type WiresMaskPortalProps = {
  children: React.ReactNode
}

/**
 * Used to place wire graphics within the wires mask.
 */
export const WiresMaskPortal = ({ children }: WiresMaskPortalProps): React.ReactElement | null => {
  const wiresMaskRef = useStore((state) => state.registry.wires.maskRef)
  const isReady = useStore((state) => state.registry.wires.maskReady)

  if (!isReady || !wiresMaskRef.current) {
    return null
  }

  return createPortal(children, wiresMaskRef.current)
}
