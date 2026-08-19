import type React from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '$'

type WirePortalProps = {
  children: React.ReactNode
}

/**
 * Used to place wire graphics within the wires annotation svg layer.
 */
export const WirePortal = ({ children }: WirePortalProps): React.ReactElement | null => {
  const wiresContainerRef = useStore((state) => state.registry.wires.underlayContainerRef)
  const isReady = useStore((state) => state.registry.wires.underlayContainerReady)

  if (!isReady || !wiresContainerRef.current) {
    return null
  }

  return createPortal(children, wiresContainerRef.current)
}
