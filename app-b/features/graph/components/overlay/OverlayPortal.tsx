import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type OverlayPortalProps = {
  children: JSX.Element
}

export const OverlayPortal = ({ children }: OverlayPortalProps): React.ReactElement => {
  const [container] = useState(() => {
    const el = document.createElement('div')

    el.style.zIndex = '9999'
    el.style.position = 'fixed'
    el.style.left = '0'
    el.style.top = '0'
    el.style.width = '100vw'
    el.style.height = '100vh'
    el.style.pointerEvents = 'none'

    return el
  })

  useEffect(() => {
    document.body.appendChild(container)

    return () => {
      document.body.removeChild(container)
    }
  }, [container])

  return createPortal(children, container)
}
