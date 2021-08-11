import { NodePen } from 'glib'
import { useGraphManager } from 'features/graph/context/graph'
import { useGraphDispatch, useGraphElements } from '../../store/graph/hooks'
import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type UnderlayPortalProps = {
  children: JSX.Element
  parent: string
}

export const UnderlayPortal = ({ children, parent }: UnderlayPortalProps): React.ReactElement | null => {
  const { register } = useGraphManager()
  const { addLiveElement, deleteLiveElements } = useGraphDispatch()

  const elements = useGraphElements()

  const [ready, setReady] = useState(false)

  const portalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add annotation element on load and register its ref
    const parentElement = elements[parent]

    if (!parentElement) {
      console.log(`🐍🐍🐍 Attempted to create an underlay for an element that doesn't exist!`)
      return
    }

    const { current } = parentElement

    const [x, y] = current.position
    const { height } = current.dimensions

    const position: [number, number] = [x - 40, y + height - 20]

    register.portal.add(parent, portalRef)

    addLiveElement({ type: 'annotation', template: { type: 'annotation', parent }, position })

    setReady(true)
  }, [])

  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ready) {
      return
    }

    const annotations = Object.values(elements).filter(
      (element): element is NodePen.Element<'annotation'> => element.template.type === 'annotation'
    )

    if (!annotations.find((annotation) => annotation.template.parent === parent)) {
      // Nothing to reference, do no work
      return
    }

    if (!portalRef.current) {
      console.log(`🐍🐍🐍 Could not reference portal's ref object on initialization!`)
      return
    }

    setContainer(portalRef.current)

    return () => {
      register.portal.remove(parent)

      // Find the underlay annotation
      const underlay = Object.values(elements).find(
        (element) => element.template.type === 'annotation' && element.template.parent === parent
      )

      if (underlay) {
        deleteLiveElements([underlay.id])
      }
    }
  }, [ready])

  return container ? createPortal(children, container, `underlay-${parent}`) : null
}
