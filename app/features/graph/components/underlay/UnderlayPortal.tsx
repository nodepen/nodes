import { useGraphManager } from 'features/graph/context/graph'
import { useGraphDispatch } from '../../store/graph/hooks'
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '@/features/common/store'

type UnderlayPortalProps = {
  children: JSX.Element
  parent: string
}

export const UnderlayPortal = ({ children, parent }: UnderlayPortalProps): React.ReactElement | null => {
  const { register } = useGraphManager()
  const { addElement, deleteLiveElements } = useGraphDispatch()

  const store = useAppStore()

  const [ready, setReady] = useState(false)

  const portalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add annotation element on load and register its ref
    const parentElement = store.getState().graph.present.elements[parent]

    if (!parentElement) {
      console.log(`🐍🐍🐍 Attempted to create an underlay for an element that doesn't exist!`)
      return
    }

    const { current } = parentElement

    const [x, y] = current.position
    const { height } = current.dimensions

    const position: [number, number] = [x - 40, y + height - 20]

    register.portal.add(parent, portalRef)

    addElement({ type: 'annotation', template: { type: 'annotation', parent }, position })

    setReady(true)
  }, [])

  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!portalRef.current) {
      console.log(`🐍🐍🐍 Could not reference portal's ref object on initialization!`)
    }

    setContainer(portalRef.current)

    return () => {
      register.portal.remove(parent)

      // Find the underlay annotation
      const elements = Object.values(store.getState().graph.present.elements)

      const underlay = elements.find(
        (element) => element.template.type === 'annotation' && element.template.parent === parent
      )

      if (underlay) {
        deleteLiveElements([underlay.id])
      }
    }
  }, [ready])

  return container ? createPortal(children, container) : null
}
