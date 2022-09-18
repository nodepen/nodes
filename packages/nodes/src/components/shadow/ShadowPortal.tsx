import type React from 'react'
import { useLayoutEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '$'

type ShadowPortalProps = {
  children?: React.ReactNode
}

export const ShadowPortal = ({ children }: ShadowPortalProps): React.ReactElement | null => {
  const rootElementRef = useStore((store) => store.registry.canvasRoot)

  const shadowContainer = useMemo(() => {
    const element = document.createElement('div')

    element.id = 'np-shadow-layer'

    element.style.zIndex = '30'
    element.style.position = 'absolute'
    element.style.width = '100%'
    element.style.height = '100%'
    element.style.pointerEvents = 'none'

    return element
  }, [])

  useLayoutEffect(() => {
    const rootElement = rootElementRef.current

    if (!rootElement) {
      return
    }

    rootElement.appendChild(shadowContainer)

    return () => {
      rootElement.removeChild(shadowContainer)
    }
  }, [shadowContainer])

  return createPortal(children, shadowContainer)
}
