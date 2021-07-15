import { useGraphManager } from '@/context/graph'
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type OverlayPortalProps = {
  children: JSX.Element
  z?: number
}

export const OverlayPortal = ({ children, z = 99 }: OverlayPortalProps): React.ReactElement => {
  const { registry } = useGraphManager()

  const [container] = useState(() => {
    const el = document.createElement('div')

    el.style.zIndex = `${z}`
    el.style.position = 'absolute'
    el.style.left = '0'
    el.style.top = '0'
    el.style.width = '100%'
    el.style.height = 'calc(100% + 48px)'
    el.style.pointerEvents = 'none'
    el.style.transform = 'translateY(-48px)'

    return el
  })

  useEffect(() => {
    if (!registry.layoutContainerRef.current) {
      return
    }

    const target = registry.layoutContainerRef.current

    registry.layoutContainerRef.current.appendChild(container)

    return () => {
      target.removeChild(container)
    }
  }, [container])

  return createPortal(children, container)
}
