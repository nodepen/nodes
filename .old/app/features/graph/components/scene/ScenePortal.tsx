import { useGraphManager } from '@/features/graph/context/graph'
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type ScenePortalProps = {
  children: JSX.Element
  z?: number
}

export const ScenePortal = ({ children, z = 99 }: ScenePortalProps): React.ReactElement => {
  const { registry } = useGraphManager()

  const [container] = useState(() => {
    const el = document.createElement('div')

    el.style.zIndex = `${z}`
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.pointerEvents = 'none'

    return el
  })

  useEffect(() => {
    if (!registry.sceneContainerRef.current) {
      return
    }

    const target = registry.sceneContainerRef.current

    registry.sceneContainerRef.current.appendChild(container)

    return () => {
      target.removeChild(container)
    }
  }, [container])

  return createPortal(children, container)
}
